#!/bin/bash
# This bash script is meant to be used to provision a Debian system with root level access for csgo-group-bot operation
sudo apt-get update
sudo apt upgrade -y 
sudo apt install nodejs npm git tmux -y

git clone https://github.com/hschickdevs/steam-group-bot.git

echo -n "alias configure-bot='cd ~/csgo-group-bot/util && clear && node ./configure.js'" >> ~/.bashrc
echo -e "\nalias start-bot='cd ~/csgo-group-bot && clear && node ./bot.js'" >> ~/.bashrc

cd ~/csgo-group-bot

npm install

clear

echo "Successfully provisioned and installed csgo-group-bot and npm version $(npm -v)!"
echo "Please reboot the machine to finish setup using 'sudo reboot'"