var SteamCommunity = require('steamcommunity');
var ReadLine = require('readline');

var SteamID = SteamCommunity.SteamID;
var community = new SteamCommunity();
var rl = ReadLine.createInterface({
    "input": process.stdin,
    "output": process.stdout
});

// 438989434389 = Me (steamcommunity.com/id/<your_id> - click on your profile and view the address bar)

rl.question("Steam User ID: ", function (userId) {
    var sid = new SteamID(userId);
    community.getSteamUser(sid, function (err, user) {
        if (err) {
            console.log('Could not get steam user: ' + err);
            process.exit(1);
        }

        console.log("Fetching " + user.groups.length + " Groups for: " + user.name + "\n");

        var groups = new Array;
        var errors = 0;
        // Build an array of groups using for loop:
        console.log("User Groups:", user.groups);
        const userGroupIds = user.groups.map(group => group.getSteamID64());

        console.log("User Group IDS: ", userGroupIds)

        for (var i = 0; i < user.groups.length; i++) {
            community.getSteamGroup(user.groups[i], function (err, group) {
                if (err) {
                    console.log('Could not get steam group: ' + err);
                    // process.exit(1);
                    errors++;
                }
                groups.push(group.url);
                console.log("Group ID: " + group.url + " | Group Name: " + group.name + " | Group ID: " + group.steamID);
                console.log(userGroupIds.includes(String(group.steamID)))

                // When the array is full, print it out:
                if (groups.length == (user.groups.length - errors)) {
                    console.log(JSON.stringify(groups));
                }
            });
        } // End for loop

        // user.groups.forEach((groupId) => {
        //     community.getSteamGroup(groupId, function(err, group) {
        //         if (err) {
        //             console.log('Could not get steam group: ' + err);
        //             process.exit(1);
        //         }
        //         groups.push(group);
        //         console.log("Group ID: " + group.url + " | Group Name: " + group.name);
        //     });
        // }).then(() => { console.log(groups); });
    });
});