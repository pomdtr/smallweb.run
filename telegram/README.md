# Telegram Integration for smallweb

## Initial Setup

1. Create a new bot using the [BotFather](https://t.me/botfather)
2. Set-up the required environment variables
    - Copy the token and set it as the `TELEGRAM_BOT_TOKEN` environment variable
    - Set the `TELEGRAM_BOT_SECRET` environment variable to a random string
    - Setup both the `SMALLWEB_API_URL` and `SMALLWEB_API_TOKEN` environment variables
3. Use `smallweb run telegram set-webhook` to set the webhook
4. Use `smallweb run telegram set-my-commands` to register the commands

## Available Commands

- `/ls`: List smallweb apps
- `/run <app> [args ...]`: Run a smallweb app cli command
- `/help`: Show this help message
