<div align="center">
    <img src="media/logo.png" width=350>
    <h2>Automatically post messages to a list of Steam groups profiles from an authenticated user. </h2>
</div>

![node version](https://img.shields.io/badge/node-≥v9.6.4-blue)
[![license](https://img.shields.io/badge/license-Apache%202.0-green)](https://github.com/hschickdevs/steam-group-bot/blob/master/LICENSE)
![version](https://img.shields.io/badge/version-v1.0.1-lightgrey)

## Overview

The primary utility of this bot is to automate posting messages to a list of Steam groups and/or profiles from an authenticated user. The original inspiration behind this bot was my desire to automate posting to different CSGO trading groups, and the lack of available tools for this. Use cases for the bot include:

* Tradeposts for trading groups (CSGO, Dota 2, TF2, etc.)
* Announcements for gaming groups
* Advertisements

This bot was written with NodeJS, and utilizes [@DoctorMcKay's](https://github.com/DoctorMcKay) node packages for Steam Community connectivity. 

### Guidelines:

> ⚠️ **Disclaimer:** This bot is not intended to be used for spamming. Automated bot usage may subject the user to moderation actions from Steam. It is recommended that you use this bot with caution and at your OWN RISK. I cannot provide any guarantee that your account will not be banned for using this bot.

The following guidelines will help keep your account safe from moderation actions:

1. Don't say anywhere on the alt's profile that the bot is "autoposting", as this is possibly against TOS. Just say that it's a redirect or alt, and to add/message your main acc.
2. Make sure that tradeposts are always in a trading forum
3. Make sure to allow other people to comment before we send our next post - set this variable in configuration script. (e.g. 6 posts minimum before we can post again)

## Pre-Requisites

In order to run this bot, you will need a few things:

* A Steam account with access to the Steam Community (It is _highly_ recommended that you use/create an alternate account for this)

* A Unix OS local machine, or a VPS (Virtual Private Server) to run the bot
    * If you don't have experience with either of these, see the steps below for more information

## Setting up the Environment:

For the sake of this documentation, I will be using https://cloud.linode.com/ as my VPS provider. Using a VPS is recommended, as it will allow you to run the bot 24/7 without having to keep your local machine on.

Running the cheapest VPS on linode costs around $5/month, and is more than enough power to run this bot.

### Creating a VPS

1. Create an account on https://cloud.linode.com/

2. Create a new Linode on https://cloud.linode.com/linodes

    Use the following settings (if a setting is not listed, leave it as default)

    * **Images:** Debian 11
    * **Region:** _Closest to you_
    * **Linode Plan**: Shared CPU -> Nanode 1GB
    * **Linode Label:** steam-group-bot
    * **Root Password:** _A secure password that you will remember_

    Now click **Create Linode** at the bottom right of the page.

3. Once your VM is finished provisioning, go back to https://cloud.linode.com/linodes and click the three dots next to your VM, then click **Launch LISH Console**

    ![console](https://i.ibb.co/ZKQsnXx/ref1.png)

4. Once the console is open, enter the following when prompted:
    * **localhost login:** root
    * **Password:** _The password you set in step 2_

You have now successfully created a VPS!

### Installing Dependencies

To install the dependencies for the bot, run the following commands in your VPS console:

First, using the installation script install the dependencies (_copy and paste the following command into your console_):

```bash
wget https://github.com/hschickdevs/steam-group-bot/blob/main/bash/install.sh && bash install.sh
```

Second, reboot the VM and wait for it to restart:

```bash
sudo reboot
```

Once you see `localhost login:` again, you can login.

After login, your VPS is now ready to run the bot!

## Running the Bot:

To run the bot, you will need to configure the bot, then start it.

### Configuring the Bot

To configure the bot you can use the configuration script that I have created for convenience. If you want to get an idea of what configuration variables exist, see [**config/README.md**](config/README.md)

To configure the bot, run the following command in your VPS console and carefully follow the prompts:

```bash
configure-bot
```

If you need to quit or restart the configuration script, you can press `CTRL + C` and rerun the command. The config is not saved until it's completed.

If you successfully completed the configuration, you can view your config file [**here**](./config/config.json)

If you are having issues, see [**Troubleshooting**](#troubleshooting) below.

### Starting the Bot

Now that you have provisioned the VPS and configured the bot, you can start the bot by running the following commands in your VPS console:

First, start a `tmux` session, which will keep the bot running even if you close the console:

```bash
tmux new
```

Second, start the bot:

```bash
start-bot
```

You will be prompted to authenticate with Steam, and once you are authenticated the bot will start! Successful authentication will look like this:

<img src="https://i.ibb.co/hm5n3y3/ref2.png" width=400>

You can safely close the terminal window and the bot will continue to run. If you want to come back to the terminal and view the bot's output, you can re-attach to the tmux session using:

```bash
tmux attach
```

If you are having issues, see [**Troubleshooting**](#troubleshooting) below.

### Stop the Bot

To stop the bot, you can enter the following command in your VPS console:

```bash
tmux kill
```

_Alternatively_, you can re-attach to the tmux session and then press `CTRL + C` to stop the bot.

## Troubleshooting

* If you keep seeing 429 errors _when trying to authenticate or configure the bot_, this is normal. Please wait a few minutes and try again. 

* If you are seeing 429 errors when the bot _starts posting between groups_, this is likely because you are posting too frequently. If you configured the bot using advanced options, then you can try to increase the post interval to a higher number.

## Contributing & Contact

If you have any questions, comments, or concerns, feel free to contact me on Telegram at [t.me/hschickdevs](https://t.me/hschickdevs). If you would like to contribute to this project, feel free to open a issue on GitHub.