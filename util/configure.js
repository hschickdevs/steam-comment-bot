// SYNCHRONOUS CONFIGURATION SCRIPT FOR THE CONFIG/CONFIG.JSON FILE

var SteamCommunity = require('steamcommunity');
const ReadLine = require('readline');
const prompt = require('prompt-sync')({ sigint: true });
let configTemplate = require('../config/config.template.json');
const fs = require('fs');

// var SteamID = SteamCommunity.SteamID;
let community = new SteamCommunity();
var rl = ReadLine.createInterface({
	"input": process.stdin,
	"output": process.stdout
});

// ------------------ MAIN ------------------ //
fs.readFile('./media/logo.txt', 'utf8', (err, data) => {
	if (err) {
	  console.error(err);
	  return;
	}
	console.log(data);
    console.log("Starting configuration script... Use CTRL + C to Quit at any time.\n")

    const steamUsername = prompt("Steam Username: ");
    const steamPassword = prompt("Steam Password: ");
    configTemplate.username = steamUsername;
    configTemplate.password = steamPassword;

    console.log("Authentication started...\n")
    run(steamUsername, steamPassword);
});

// ------------------ MAIN FUNCTIONS ------------------ //
function run(accountName, password, authCode, twoFactorCode, captcha) {
    community.login({
        "accountName": accountName,
        "password": password,
        "authCode": authCode,
        "twoFactorCode": twoFactorCode,
        "captcha": captcha
    }, function (err, sessionID) { // , sessionID, cookies, steamguard
        if (err) {
            if (err.message == 'SteamGuardMobile') {
                rl.question("Steam Authenticator Code: ", function (code) {
                    run(accountName, password, null, code);
                });

                return;
            }

            if (err.message == 'SteamGuard') {
                console.log("An email has been sent to your address at " + err.emaildomain);
                rl.question("Steam Guard Code: ", function (code) {
                    run(accountName, password, code);
                });

                return;
            }

            if (err.message == 'CAPTCHA') {
                console.log(err.captchaurl);
                rl.question("CAPTCHA: ", function (captchaInput) {
                    run(accountName, password, authCode, twoFactorCode, captchaInput);
                });

                return;
            }
            console.log(err);
            process.exit(1);
        }

        // console.log("\nFetching user groups...")
        community.getSteamUser(community.steamID, function (err, user) {
            if (err) {
                console.log('Could not get steam user: ' + err);
                process.exit(1);
            }

            console.log("\nFetching " + user.groups.length + " Groups for: " + user.name + "\n");

            var groups = new Array;
            var groupNames = new Array;
            var errors = 0;
            // Build an array of groups using for loop:
            // console.log("User Groups:", user.groups);
            // const userGroupIds = user.groups.map(group => group.getSteamID64());

            // console.log("User Group IDS: ", userGroupIds)

            for (var i = 0; i < user.groups.length; i++) {
                community.getSteamGroup(user.groups[i], function (err, group) {
                    if (err) {
                        console.log('Could not get steam group: ' + err);
                        // process.exit(1);
                        errors++;
                    }
                    groups.push(group.url);
                    groupNames.push(group.name);
                    // console.log("Group ID: " + group.url + " | Group Name: " + group.name + " | Group ID: " + group.steamID);
                    
                    // When the array is full, return it:
                    if (groups.length == (user.groups.length - errors)) {
                        // console.log(JSON.stringify(groups));

                        // CONFIGURATION BODY
                        const ignoreGroups = prompt("Ignore any Groups? (y/n): ");
                        if (ignoreGroups == "y") {
                            console.log("\nYou are in the following groups:")
                            for (var i = 0; i < groups.length; i++) {
                                console.log(`${i + 1}: ` + groups[i] + " (" + groupNames[i] + ")");
                            }

                            console.log("");
                            const groupsToExclude = prompt("Please enter the indexes of groups that you would like to exclude, separated by commas (e.g. 3,23,52): ");
                            let excludedGroups = groupsToExclude.split(",");

                            // remove each index from the groups array that is in excludedGroups
                            for (var i = 0; i < excludedGroups.length; i++) {
                                groups.splice(parseInt(excludedGroups[i]) - 1, 1);
                            }

                            console.log(`\nExcluding ${excludedGroups.length}/${groups.length} groups.`);
                            console.log(`Using the remaining ${groups.length} groups:`);
                            for (var i = 0; i < groups.length; i++) {
                                console.log("* " + groups[i] + " (" + groupNames[i] + ")");
                            }
                        }
                        configTemplate.groups = groups;

                        console.log("");
                        const messageLocation = prompt("Use Pastebin or Local Text File for Message? (pastebin/local): ");
                        if (messageLocation == "pastebin") {
                            configTemplate.usePastebin = true;
                            configTemplate.pastebinURL = prompt("Please enter the RAW URL of your pastebin containing the message: ");
                        } else if (messageLocation == "local") {
                            console.log("Using local text file for message.\nMake sure that your message is in a file called 'message.txt' in the /config directory.")
                            configTemplate.usePastebin = false;
                            configTemplate.pastebinURL = null;
                        }

                        console.log("");
                        const useTelegram = prompt("Would you like to use Telegram notifications? (y/n): ");
                        if (useTelegram == "y") {
                            configTemplate.tg_bot_token = prompt("Please enter your Telegram bot token: ");
                            configTemplate.tg_chat_id = prompt("Please enter your Telegram chat ID: ");
                        } else {
                            configTemplate.tg_bot_token = null;
                            configTemplate.tg_chat_id = null;
                        }

                        console.log("");
                        const advancedConfigure = prompt("Would you like to configure advanced options? (y/n): ");
                        if (advancedConfigure == "y") {
                            const interval = parseInt(prompt("Set interval (integer): "));
                            const groupPostDelay = parseInt(prompt("Set group post delay (integer): "));
                            const antiSpamCount = parseInt(prompt("Set anti-spam count (integer): "));

                            console.log("Confirm Settings:\nInterval: " + interval + "\nGroup Post Delay: " + groupPostDelay + "\nAnti-Spam Count: " + antiSpamCount + "\n");
                            const confirm = prompt("(y/n): ");
                            if (confirm == "y") {
                                configTemplate.interval = interval;
                                configTemplate.group_post_delay = groupPostDelay;
                                configTemplate.anti_spam_count = antiSpamCount;
                            } else {
                                console.log("Settings not confirmed, using default advanced options:\nInterval: " + configTemplate.interval + "\nGroup Post Delay: " + configTemplate.group_post_delay + "\nAnti-Spam Count: " + configTemplate.anti_spam_count);
                            }
                        }

                        fs.writeFile('../config/config.json', JSON.stringify(configTemplate, null, 4), function (err) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("\nConfiguration complete! Please restart the bot.");
                                process.exit(1);
                            }
                        });
                    }
                });
            }
        });
    });
}