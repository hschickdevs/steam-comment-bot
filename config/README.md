## Config Structure (see [config template](config.template.json)):

- **interval** _(integer)_ - How often the bot should post in each of the provided list of `groups` (in seconds).
    * For example, if you have 5 groups in the `groups` list, and an `interval` of 3600, the bot will post to each group every 3600 seconds (1 hour).

- **tg_bot_token** _(string)_ - (OPTIONAL) If you'd like to enable telegram alerts, you can pass the bot token for your telegram bot here.

- **tg_chat_id** _(string)_ - (OPTIONAL) If you'd like to enable telegram alerts, you can pass the chat id for your telegram bot to send messages to here.

- **group_post_delay** _(integer)_ - How long the bot should wait between posting to each individual group in the provided list of `groups` inside of each `interval` (in seconds).

- **anti_spam_count** - _(integer)_ - How many posts should be sent to each group by other users before the bot posts again (to prevent spamming inactive groups).
    * Recommended to be at least 5 (about one page of posts), or the bot will be at risk of being community banned

- **join_unlisted_groups** _(boolean)_ - Whether or not the bot should join groups that are listed in the config, but not in the user's Steam group list.

- **message** _(string)_ - The message to send to each group in the provided list of `groups` at each `interval`
    * If `null`, the bot looks for a file named `message.txt` in the `config` directory, and uses the contents of that file as the message.

- **username** _(string)_ - The username of the account to run the bot on.

- **password** _(string)_ - The password of the account to run the bot on.

- **groups** _(array[string])_ - List of group "urls" to send the tradepost to. You can find the group "url" by navigating to your group in your web browser, and viewing the URL in the address bar. The group "url" is the part after "steamcommunity.com/groups/".

    E.g. `https://steamcommunity.com/groups/iTraders` -> `iTraders`