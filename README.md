# Bus Arrival Timing Telegram Bot w/ NodeJS & LTA Datamall
_Note: These codes are part of the tutorial: [GO SERVERLESS: Create a serverless NodeJS Telegram Bot with AWS Lambda & API Gateway](https://samleewy.com/blog/find-the-next-bus-timing-build-your-own-next-bus-arrival-timing-bot-part-1/), for more info, please visit my blog!_

## What this bot does?
It takes in the command `/get <bus stop no.> <bus service no.>` and sends back bus arrival timing in minutes.


## How to run?
1. Install NPM packages: `$ npm init`

2. Create a `.env` file, add `TELEGRAM_BOT_TOKEN=<telegram bot token>` and `LTA_DATAMALL_KEY=<LTA Datamall AccountKey>`, separated by line break

3. Run Telegram Bot `$ node app.js`
