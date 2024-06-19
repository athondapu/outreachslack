'use strict';

require('dotenv').config();

const requiredEnvVars = [
    'OUTREACH_CLIENT_ID',
    'OUTREACH_CLIENT_SECRET',
    'OUTREACH_LOGIN_URL',
    'HEROKU_URL',
    'HMAC_KEY',
    'SLACK_BOT_TOKEN',
    'SLACK_SIGNING_SECRET'
];
requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        console.error(`Missing ${envVar} environment variable`);
        process.exit(-1);
    }
});

const outreach = {
    clientId: process.env.OUTREACH_CLIENT_ID,
    clientSecret: process.env.OUTREACH_CLIENT_SECRET,
    herokuUrl: process.env.HEROKU_URL,
};

const slack = {
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    port: process.env.PORT || 3000,
    aesKey: process.env.AES_KEY,
    // socketMode: true,
    // appToken: process.env.SLACK_APP_TOKEN
};

module.exports = {
    outreach,
    slack,
    hmacKey: process.env.HMAC_KEY
};
