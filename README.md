<center>
    <img src="media/logo.png" width=350>
    <h2>Automatically post messages to a list of Steam groups profiles from an authenticated user. </h2>
</center>

___

![node version](https://img.shields.io/badge/node-v9.6.4-blue)
[![license](https://img.shields.io/npm/l/steam-tradeoffer-manager.svg)](https://github.com/hschickdevs/steam-group-bot/blob/master/LICENSE)
![version](https://img.shields.io/badge/version-v1.0.1-lightgrey)

## Overview

The primary utility of this bot is to automate posting messages to a list of Steam groups and/or profiles from an authenticated user. The original inspiration behind this bot was my desire to automate posting to different CSGO trading groups, and the lack of available tools for this. Use cases for the bot include:

* Tradeposts for trading groups (CSGO, Dota 2, TF2, etc.)
* Announcements for gaming groups
* Advertisements

> ⚠️ **Disclaimer:** This bot is not intended to be used for spamming. Automated bot usage may subject the user to moderation actions from Steam. It is recommended that you use this bot with caution and at your own risk.

This bot was written with NodeJS, and utilizes [@DoctorMcKay's](https://github.com/DoctorMcKay) node packages for Steam Community connectivity. 

## Pre-Requisites

In order to run this bot, you will need a few things:

* A Steam account with access to the Steam Community (It is _highly_ recommended that you use/create an alternate account for this)

* A Unix OS local machine, or a VPS (Virtual Private Server) to run the bot
    * If you don't have experience with either of these, see the steps below for more information

## Setting up the Environment

For the sake of this documentation, I will be using https://cloud.linode.com/ as my VPS provider. Using a VPS is recommended, as it will allow you to run the bot 24/7 without having to keep your local machine on.

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

## How to Run the Bot:

1. Create Debian VM using https://cloud.linode.com/
2. run the `provision.sh` script
3. reboot the VM `sudo reboot`
4. Configure the bot
5. Run with the `start-bot` alias

## Outline:

- on setInterval, the bot should pull the latest list of groups from the data source, then send the specified tradepost to all of these groups while respecting the daily post limit.

## A few things that we need to keep in mind if you want to running the bot:
1. Don't say anywhere on the alt's profile that the bot is "autoposting", as this is possibly against TOS. Just say that it's a redirect, and to add/message your main acc.
2. Make sure that tradeposts are always in a trading forum (This might be why we got temp banned)
3. Make sure that we are waiting for other people to comment before we send our next post. (e.g. 6 posts minimum before we can post again)