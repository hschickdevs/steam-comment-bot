#!/bin/bash

# Check if the session exists and kill it
tmux has-session -t bot-session 2>/dev/null && tmux kill-session -t bot-session

# Start a new session and keep it interactive after the bot command completes
tmux new-session -d -s bot-session "cd ~/steam-group-bot && clear && node ./bot.js; bash -i"
