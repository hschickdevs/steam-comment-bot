const SteamCommunity = require('steamcommunity');
const ReadLine = require('readline');
const TelegramBot = require('node-telegram-bot-api');
const fetch = require("node-fetch");
var fs = require('fs');
var util = require('util');

try {
    config = require('./config/config.json');
} catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
        console.error('The config file does not exist. Please ensure you have a config/config.json file.');
        process.exit(1); // Exit with a failure code
    }
    throw error; // Re-throw the error if it's not a "module not found" error
}


// ------------------------------ MAIN ------------------------------ //

fs.readFile('./media/logo.txt', 'utf8', (err, data) => {
	if (err) {
	  console.error(err);
	  return;
	}
	console.log(data);

// SETUP FILE & STDOUT LOGGING
var logFile = fs.createWriteStream('log.txt', { flags: 'a' });
// Or 'w' to truncate the file every time the process starts.
var logStdout = process.stdout;
console.log = function () {
	logFile.write('> ' + new Date().toISOString() + ': ' + util.format.apply(null, arguments) + '\n');
	logStdout.write(util.format.apply(null, arguments) + '\n');
}

const tgBot = config.tg_bot_token ? new TelegramBot(config.tg_bot_token) : null;

// PROCESS CONFIG:
// - Check for required config values
if (!config.username || !config.password || !config.groups || config.groups.length == 0) {
	console.log("Invalid config! Please run the `configure-bot` command?");
	process.exit(1);
}
// - Check for optional config values
if (!config.message) {
	// Read message from ./config/message.txt
	try {
		config.message = fs.readFileSync('./config/message.txt', 'utf8');
	} catch (err) {
		console.log("No message was set in the config, and could not read message from ./config/message.txt");
		process.exit(1);
	}
}

var rl = ReadLine.createInterface({
	"input": process.stdin,
	"output": process.stdout
});

/**
 * @todo Add auto login with shared secret (twoFactorAuthenticator?)
 * 	- This is not necessary, can just login for each account on startup.
 */
if (config.username && config.password && config.groups.length > 0) {
	console.log("Starting authentication for " + config.username + "...");
	doLogin(config.username, config.password);
} else {
	console.log("Invalid config for user " + config.username);
}


// ------------------------------ FUNCTIONS ------------------------------ //

function doLogin(accountName, password, authCode, twoFactorCode, captcha) {
	let community = new SteamCommunity();

	community.login({
		"accountName": accountName,
		"password": password,
		"authCode": authCode,
		"twoFactorCode": twoFactorCode,
		"captcha": captcha
	}, function (err) { // , sessionID, cookies, steamguard
		if (err) {
			if (err.message == 'SteamGuardMobile') {
				rl.question("Steam Authenticator Code: ", function (code) {
					doLogin(accountName, password, null, code);
				});

				return;
			}

			if (err.message == 'SteamGuard') {
				console.log("An email has been sent to your address at " + err.emaildomain);
				rl.question("Steam Guard Code: ", function (code) {
					doLogin(accountName, password, code);
				});

				return;
			}

			if (err.message == 'CAPTCHA') {
				console.log(err.captchaurl);
				rl.question("CAPTCHA: ", function (captchaInput) {
					doLogin(accountName, password, authCode, twoFactorCode, captchaInput);
				});

				return;
			}

			console.log(err);
			process.exit(1);
		}

		// console.log("Getting steam user...")
		community.getSteamUser(community.steamID, function (err, user) {
			if (err) {
				console.log('Could not get steam user: ' + err);
				process.exit(1);
			}
			console.log("Logged on as " + accountName + "...");

			// JOIN UNLISTED GROUPS IF CONFIGURED
			if (config.join_unlisted_groups) {
				const userGroupIds = user.groups.map(g => g.getSteamID64());

				console.log("Checking unlisted groups... Est. time: " + ((config.group_post_delay * config.groups.length) / 60).toFixed(1) + " min");
				let itemsProcessed = 0;
				config.groups.forEach((gid, i) => {
					setTimeout(() => {
						community.getSteamGroup(gid, function (err, group) {
							if (err) {
								console.log(`Could not get steam group: ${err}`);
								return;
							}
							// Check if user is already in group
							if (userGroupIds.includes(String(group.steamID))) {
								console.log(`Already in group (${i + 1}/${config.groups.length}): ${gid}`);
							} else {
								community.joinGroup(group.steamID, (err) => {
									if (err) {
										console.log(`Could NOT JOIN group (${i + 1}/${config.groups.length}) ${gid}: ${err}`);
									} else {
										console.log(`Joined group (${i + 1}/${config.groups.length}): ${gid}`);
									}
								});
							}
						});
					}, (config.group_join_delay * i) * 1000);
				});
			}

			console.log("Starting group post interval...")

			try {
				run(community, config.interval, config.groups, config.message);
			} catch (e) {
				console.log("An error occured in the run function: %j", e);
				tgBot.sendMessage(config.tg_chat_id, "Critical error occured in the run function: %j" + String(e));

				process.exit(1);
			}

		});
	});
}


/**
 * Helper function for run - posts a comment to a single Steam group
 * @param {SteamCommunity} community - SteamCommunity instance for an authenticated user
 * @param {String} gid - Steam group ID
 * @param {String} message - Message to post
*/
function postGroupComment(community, gid, message) {
	community.getSteamGroup(gid, function (err, group) {
		if (err) {
			console.log(`Could not get steam group with gid ${gid}:`, err);
			tgBot.sendMessage(config.tg_chat_id, `Could not get steam group ${gid}: ${err}`);
			process.exit(1);
		}

		group.getAllComments(0, config.anti_spam_count, function (err, comments) {
			if (err) {
				console.log(`Could not get comments for group ${gid}:`, err);
				tgBot.sendMessage(config.tg_chat_id, `Could not get comments for group ${gid}: ${err}`);
				return;
			}
			if (comments.length > 0) {
				// Chcek if the authorId of any of the comments is the same as the bot's
				// If so, don't post the comment
				if (comments.some(c => c.authorId == community.steamID)) {
					console.log(`Anti-spam not satisfied in group '${gid}' - not posting comment`);
					return;
				}
			}

			if (config.usePastebin) {
				// Get message from pastebin
				fetch(config.pastebinURL).then(res => res.text()).then(message => {
					doComment(group, message);
				});
			} else {
				doComment(group, message);
			}
		});
	});
}
/**
 * Helper function to decrease code duplication in postGroupComment
 * @param {SteamGroup} group - SteamCommunity instance for an authenticated user
 * @param {String} message - Message to post
 */
function doComment(group, message) {
	group.comment(message, function (err) {
		if (err) {
			console.log(`Could not post comment to group ${gid}:`, err);
			tgBot.sendMessage(config.tg_chat_id, `Could not send message to steam group ${gid}: ${err}`);
			process.exit(1);
		}

		console.log("Comment posted on group: " + group.name + " at " + new Date().toLocaleString());
	});
}


/**
 * Post comments to an array of Steam groups on a specified interval
 * @param {SteamCommunity} community - SteamCommunity instance for an authenticated user
 * @param {Array} interval - Seconds between each series of posts
 * @param {Array} groups -  Array of Steam group IDs
 * @param {String} message - Message to post
 */
function run(community, interval, groups, message) {
	var i_id = 0;
	var interval = setInterval(function intervalFunc() {
		// Alert telegram that message was sent if tg_bot_token is set in config
		if (tgBot) {
			tgBot.sendMessage(config.tg_chat_id, "Posting to " + groups.length + " group(s) on interval " + i_id)
		}
		console.log("Posting to " + groups.length + " group(s) on interval " + i_id);

		groups.forEach((gid, i) => {
			// Add a delay of 5 seconds between each `postGroupComment`
			setTimeout(() => {
				postGroupComment(community, gid, message);
			}, (config.group_post_delay * i) * 1000);
		});
		i_id++;
		return intervalFunc;
	}(), interval * 1000);
}
});