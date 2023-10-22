#!/bin/bash
# This bash script is meant to be used to provision a Debian system with root level access for csgo-group-bot operation
sudo apt-get update
sudo apt upgrade -y 
sudo apt install nodejs npm git tmux -y

git clone https://github.com/hschickdevs/steam-group-bot.git
cd steam-group-bot

# Adding alias to configure the bot
echo -e "\nalias configure-bot='cd ~/steam-group-bot/util && clear && node ./configure.js'" >> ~/.bashrc

# Adding alias to start the bot within a new tmux session or attach to it if it already exists
echo -e "\nalias start-bot='tmux new-session -d -s bot-session \"cd ~/steam-group-bot && clear && node ./bot.js\" || tmux attach -t bot-session'" >> ~/.bashrc

# Adding alias to view the bot by attaching to the tmux session, if it exists
echo -e "\nalias view-bot='tmux attach -t bot-session || echo \"Session does not exist. Maybe the bot is not running?\"'" >> ~/.bashrc

# Adding alias to stop the bot by killing the tmux session
echo -e "\nalias stop-bot='tmux kill-session -t bot-session && echo \"Bot session stopped.\" || echo \"Failed to stop bot session. Maybe its not running?\"'" >> ~/.bashrc

npm install

clear

echo "Successfully provisioned and installed Steam Group Bot and npm version $(npm -v)!"
echo "Please reboot the machine to finish setup using 'sudo reboot'"

# Remove the script once it's completed
cd ..
rm -- "$0"