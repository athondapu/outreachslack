'use strict';
const sh = require('shelljs');
const chalk = require('chalk');
const fs = require('fs');
const log = console.log;
const { getRandomString } = require('./util');

const setupHerokuApp = () => {
    log('');
    log(
        `${chalk.bold('*** Setting up Heroku app')} ${chalk.dim(
            '(step 2 of 2)'
        )}`
    );
    // Check user is correctly logged into Heroku
    const whoAmI = sh.exec('heroku whoami', { silent: true });
    if (whoAmI.stderr && whoAmI.stderr.includes('not logged in')) {
        throw new Error(
            'Not logged into Heroku. Run heroku login to authenticate yourself.'
        );
    }
    // Check app name is not already used
    const appNameCheck = sh.exec(`heroku apps:info ${sh.env.HEROKU_APP_NAME}`, {
        silent: true
    });
    log(`App Name: ${sh.env.HEROKU_APP_NAME} and current branch: ${sh.env.CURRENT_BRANCH}`)
    console.log("appNameCheck: ", appNameCheck);
    
    if (appNameCheck.stdout.includes(sh.env.HEROKU_APP_NAME)) {
        throw new Error(`App name already in use: ${sh.env.HEROKU_APP_NAME}`);
    }
    const appBase = 'apps/outreachslack';
    sh.cd(appBase);

    log(`*** Creating Heroku app ${chalk.bold(sh.env.HEROKU_APP_NAME)}`);
    console.log(`heroku apps:create ${sh.env.HEROKU_APP_NAME} --json --buildpack https://github.com/lstoll/heroku-buildpack-monorepo.git`);
    const appData = JSON.parse(
        sh.exec(
            `heroku apps:create ${sh.env.HEROKU_APP_NAME} --json --buildpack https://github.com/lstoll/heroku-buildpack-monorepo.git`,
            { silent: true }
        )
    );
    log('appData: ', appData);
    sh.env.HEROKU_APP_NAME = appData.name;
    sh.env.HEROKU_URL = appData.web_url.substring(
        0,
        appData.web_url.length - 1
    ); // Remove final slash
    sh.env.AES_KEY = getRandomString(32);

    log('*** Adding Node.js Buildpack');
    sh.exec(
        `heroku buildpacks:add -a ${sh.env.HEROKU_APP_NAME} heroku/nodejs`,
        {
            silent: true
        }
    );

    log('*** Writing .env file for local development', sh.env.PRIVATE_KEY);
    // Base64 encode the PRIVATE_KEY
    // const privateKeyBase64Encode = Buffer.from(sh.env.PRIVATE_KEY).toString(
    //     'base64'
    // );
    // Env variables for Slack Auth
    fs.writeFileSync('.env', ''); // empty the .env file for fresh write
    fs.appendFileSync(
        '.env',
        'SLACK_SIGNING_SECRET=' + sh.env.SLACK_SIGNING_SECRET + '\r\n'
    );
    fs.appendFileSync(
        '.env',
        'SLACK_BOT_TOKEN=' + sh.env.SLACK_BOT_TOKEN + '\r\n'
    );
    fs.appendFileSync('.env', 'HEROKU_URL=' + sh.env.HEROKU_URL + '\r\n');
    fs.appendFileSync('.env', 'OUTREACH_CLIENT_ID=' + sh.env.OUTREACH_CLIENT_ID + '\r\n');
    fs.appendFileSync(
        '.env',
        'OUTREACH_CLIENT_SECRET=' + sh.env.OUTREACH_CLIENT_SECRET + '\r\n'
    );
    fs.appendFileSync('.env', 'AES_KEY=' + sh.env.AES_KEY + '\r\n');
    fs.appendFileSync('.env', 'HMAC_KEY=' + sh.env.HMAC_KEY + '\r\n');
    fs.appendFileSync('.env', 'OUTREACH_LOGIN_URL=' + sh.env.OUTREACH_LOGIN_URL + '\r\n');
    fs.appendFileSync('.env', 'OUTREACH_CALLBACK_URL=' + sh.env.OUTREACH_CALLBACK_URL + '\r\n');
    fs.appendFileSync('.env', 'OUTREACH_TOKEN_URL=' + sh.env.OUTREACH_TOKEN_URL + '\r\n');
    fs.appendFileSync('.env', 'OUTREACH_TASK_STAGING_API_URL=' + sh.env.OUTREACH_TASK_STAGING_API_URL + '\r\n');
    fs.appendFileSync('.env', 'OUTREACH_TASK_STAGING_WEB_URL=' + sh.env.OUTREACH_TASK_STAGING_WEB_URL + '\r\n');
    fs.appendFileSync('.env', 'PORT=' + sh.env.PORT + '\r\n');
    // fs.appendFileSync('.env', 'PRIVATE_KEY=' + privateKeyBase64Encode);

    log('*** Pushing app to Heroku');
    log('*** Setting remote configuration parameters');
    // sh.exec(
    //     `heroku config:set PRIVATE_KEY=${privateKeyBase64Encode} -a ${sh.env.HEROKU_APP_NAME}`,
    //     { silent: true }
    // );
    // Needed by buildpack
    sh.exec(
        `heroku config:set APP_BASE=${appBase} -a ${sh.env.HEROKU_APP_NAME}`
    );
    sh.exec(
        `heroku config:set SLACK_BOT_TOKEN=${sh.env.SLACK_BOT_TOKEN} -a ${sh.env.HEROKU_APP_NAME}`,
        { silent: true }
    );
    sh.exec(
        `heroku config:set SLACK_SIGNING_SECRET=${sh.env.SLACK_SIGNING_SECRET} -a ${sh.env.HEROKU_APP_NAME}`,
        { silent: true }
    );
    sh.exec(
        `heroku config:set OUTREACH_CLIENT_ID=${sh.env.OUTREACH_CLIENT_ID} -a ${sh.env.HEROKU_APP_NAME}`,
        { silent: true }
    );
    sh.exec(
        `heroku config:set OUTREACH_LOGIN_URL=${sh.env.OUTREACH_LOGIN_URL} -a ${sh.env.HEROKU_APP_NAME}`,
        { silent: true }
    );
    sh.exec(
        `heroku config:set OUTREACH_CALLBACK_URL=${sh.env.OUTREACH_CALLBACK_URL} -a ${sh.env.HEROKU_APP_NAME}`,
        { silent: true }
    );
    sh.exec(
        `heroku config:set OUTREACH_TOKEN_URL=${sh.env.OUTREACH_TOKEN_URL} -a ${sh.env.HEROKU_APP_NAME}`,
        { silent: true }
    );
    sh.exec(
        `heroku config:set OUTREACH_TASK_STAGING_API_URL=${sh.env.OUTREACH_TASK_STAGING_API_URL} -a ${sh.env.HEROKU_APP_NAME}`,
        { silent: true }
    );
    sh.exec(
        `heroku config:set OUTREACH_TASK_STAGING_WEB_URL=${sh.env.OUTREACH_TASK_STAGING_WEB_URL} -a ${sh.env.HEROKU_APP_NAME}`,
        { silent: true }
    );
    sh.exec(
        `heroku config:set PORT=${sh.env.PORT} -a ${sh.env.HEROKU_APP_NAME}`,
        { silent: true }
    );
    sh.exec(
        `heroku config:set OUTREACH_CLIENT_SECRET=${sh.env.OUTREACH_CLIENT_SECRET} -a ${sh.env.HEROKU_APP_NAME}`,
        { silent: true }
    );
    sh.exec(
        `heroku config:set HEROKU_URL=${sh.env.HEROKU_URL} -a ${sh.env.HEROKU_APP_NAME}`,
        { silent: true }
    );
    sh.exec(
        `heroku config:set AES_KEY=${sh.env.AES_KEY} -a ${sh.env.HEROKU_APP_NAME}`,
        { silent: true }
    );
    sh.exec(
        `heroku config:set HMAC_KEY=${sh.env.HMAC_KEY} -a ${sh.env.HEROKU_APP_NAME}`,
        { silent: true }
    );
    sh.cd('../../');
    log(`App Name: ${sh.env.HEROKU_APP_NAME} and current branch: ${sh.env.CURRENT_BRANCH}`)
    log(`git push https://git.heroku.com/${sh.env.HEROKU_APP_NAME}.git ${sh.env.CURRENT_BRANCH}:main`);
    sh.exec(
        `git push https://git.heroku.com/${sh.env.HEROKU_APP_NAME}.git ${sh.env.CURRENT_BRANCH}:main`
    );

    log(
        chalk.green(
            `*** ✔ Done deploying Heroku app ${chalk.bold(
                sh.env.HEROKU_APP_NAME
            )}`
        )
    );
};

module.exports = { setupHerokuApp };
