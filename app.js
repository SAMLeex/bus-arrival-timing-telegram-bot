const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv').config();
const axios = require('axios');
const moment = require('moment');

// Create a bot that uses 'polling' to fetch new updates (needed if not web hook)
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: true});

// helper functions

// getBusArrivalTiming => Promise
const getBusArrivalTiming = (busStopNo, busNo) => {
    const headers = {
        'AccountKey': process.env.LTA_DATAMALL_KEY
    };

    const params = {
        'BusStopCode': busStopNo,
        'ServiceNo': busNo
    }

    return axios.get('http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2', { headers, params });
};

// handles /start command when user clicks the 'Start Bot' button
bot.onText(/\/start/, (msg, _) => {
    const chatId = msg.chat.id;

    // send a welcome message
    bot.sendMessage(chatId, 'Welcome to BATTB! Use /get <bus stop no.> <bus service no.> to get started!');
});

bot.onText(/^\/get (\S+) (\S+)$/, (msg, match) => {
    const chatId = msg.chat.id;
    const busStopNo = match[1];
    const busNo = match[2];

    getBusArrivalTiming(busStopNo, busNo).then(res => {
        const data = res.data;
        const services = data.Services[0]; // contains nextbus, nextbus2, nextbus3
        const nextBus = services.NextBus;

        if (data.Services.length > 0) {
            const nextBusTiming = moment(nextBus.EstimatedArrival).diff(moment(), 'minutes');
            if (nextBusTiming > 0) {
                bot.sendMessage(chatId, `Bus ${busNo} is arriving in ${nextBusTiming} minute(s)!`);
            } else {
                bot.sendMessage(chatId, `Bus ${busNo} is round the corner! Get ready to tap your ezlink!`);
            }
        } else {
            bot.sendMessage(chatId, `Bus ${busNo} at bus stop ${busStopNo} is not operating at the moment or does not exist, try another one?`);
        }
    }, err => {
        console.log(err); // for debugging purposes 
        bot.sendMessage(chatId, 'There were some issues retrieving the arrival timings! Please try again.');
    });
});

// handle any messages that fall through
bot.on('message', (msg) => {
    if (!(/^\/get (\S+) (\S+)$/.test(msg.text)) && msg.text !== '/start') {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, 'Your wish is my command, perhaps try /get <bus stop no.> <bus service no.>?');
    }
});