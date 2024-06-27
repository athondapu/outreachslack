'use strict';
const sh = require('shelljs');
const chalk = require('chalk');

const { userInputPrompt } = require('./deploy/get-user-input');
const { setupHerokuApp } = require('./deploy/setup-heroku-app');

const log = console.log;

sh.env.PROJECT_ROOT_DIR = sh
    .exec('git rev-parse --show-toplevel')
    .toString()
    .replace(/\n+$/, '');
console.log("sh.env.PROJECT_ROOT_DIR: ", sh.env.PROJECT_ROOT_DIR);

sh.env.CURRENT_BRANCH = sh
    .exec('git branch --show-current', {
        silent: true
    })
    .toString()
    .replace(/\n+$/, '');
console.log("sh.env: ", sh.env);
sh.env.HEROKU_APP_NAME = '';
sh.env.SLACK_BOT_TOKEN = '';
sh.env.SLACK_SIGNING_SECRET = '';
sh.env.OUTREACH_LOGIN_URL = 'https://api.outreach-staging.com';
sh.env.OUTREACH_CALLBACK_URL = 'https://outreachslack-7b6317175f29.herokuapp.com/oauthcallback';
sh.env.OUTREACH_TOKEN_URL = 'https://api.outreach-staging.com/oauth/token';
sh.env.OUTREACH_TASK_STAGING_API_URL = 'https://api.outreach-staging.com/api/v2/tasks';
sh.env.OUTREACH_TASK_STAGING_WEB_URL = 'https://web.outreach-staging.com/tasks';
sh.env.PORT = 7000;
sh.env.HEROKU_URL = '';
sh.env.OUTREACH_CLIENT_SECRET = '';
sh.env.SLACK_APP_TOKEN = '';
sh.env.AES_KEY = '';
sh.env.HMAC_KEY = '';

(async () => {
    try {
        // Run the commands in the rest of this script from the root directory
        sh.cd(sh.env.PROJECT_ROOT_DIR);
        // Ask user to input values needed for the deploy
        await getUserInput();
        // Heroku Setup
        console.log("sh.env: ", sh.env);
        await setupHerokuApp();
    } catch (err) {
        log(chalk.bold.red(`*** ERROR: ${err}`));
    }
})();

async function getUserInput() {
    log('');
    log(chalk.bold('*** Please provide the following information: '));
    const response = await userInputPrompt();
    sh.env.HEROKU_APP_NAME = response['heroku-app'];
    sh.env.SLACK_BOT_TOKEN = response['slack-bot-token'];
    sh.env.SLACK_SIGNING_SECRET = response['slack-signing-secret'];
    sh.env.OUTREACH_CLIENT_ID = response['outreach-client-id'];
    sh.env.OUTREACH_CLIENT_SECRET = response['outreach-client-secret'];
    sh.env.AES_KEY = response['aes-key'];
}
