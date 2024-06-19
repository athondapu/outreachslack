'use strict';
const url = require('url');
const fs = require('fs');
const path = require('path');
const { upsert } = require('../outreach/dml/slack-authentication');
const { authWithOutreach } = require('../middlewares/outreach-auth');
const { post } = require('../utilities/axiosHttp');
const { reloadAppHome } = require('../utilities');
const persistedClient = require('../store/bolt-web-client');

const fetchOAuthToken = async (req, res) => {
    console.log('Executing user to user OAuth callback');

    try {
        // Retrieve slackuserId from session
        const slackUserId = req.session.slackUserId;
        // let code = url.parse(req.url, true).query.code;
        // await _requestAccessAndRefreshTokens(code);

        if (slackUserId) {
            // Parse Authorization Code
            let code = url.parse(req.url, true).query.code;

            // Request Access and Refresh tokens
            const authInfo = await _requestAccessAndRefreshTokens(code);

            // Upsert record in Salesforce
            console.log(
                'Correctly authorized, Storying tokens in Outreach: ',
                authInfo
            );
            await upsert(
                authInfo.connection,
                slackUserId,
                authInfo.outreachUserId
            );

            // Force execution of auth middleware so that user to user auth
            // flow is executed and we obtain the user context
            const context = await authWithOutreach({
                slackUserId: slackUserId
            });

            console.log('context in fetchOAuthToken: ', context);

            const body = {
                user: { id: slackUserId },
                view: {},
                team: {}
            };

            await reloadAppHome(
                context,
                persistedClient.client,
                body,
                slackUserId
            );

            // Show travel requests in app home
            // Need to refresh the AppHome Screen

            // Send success message
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(
                fs.readFileSync(
                    path.resolve(__dirname, '../routes/oauth-success.html')
                ),
                'utf-8'
            );
        } else {
            res.writeHead(500);
            res.end(
                'Missing Slack User Id in session. Failed to connect to Outreach',
                'utf-8'
            );
        }
    } catch (e) {
        console.error(e);
        res.writeHead(500);
        res.end('Failed to connect to Salesforce', 'utf-8');
    }
};

const _requestAccessAndRefreshTokens = async (code) => {
    console.log('Code: ', code);

    // TODO Get accesstoken and refreshtoken with the code
    const { data } = await post(
        'https://api.outreach-staging.com/oauth/token',
        {
            client_id: 'HyZZJGyA5IqkrVVIhNN5Zd5GZ3e4dz7uPHsw9OHwa8Bm',
            client_secret: '}ZkTXu?fdk**3H-!Mt7/F]omDu@Oage1@K{Ns.B`qfT',
            redirect_uri:
                'https://5a0b-125-17-251-66.ngrok-free.app/oauthcallback',
            grant_type: 'authorization_code',
            code: code
        }
    );

    console.log('response: ', data);
    const { access_token, refresh_token, token_type } = data;

    return {
        connection: {
            accessToken: access_token,
            refreshToken: refresh_token,
            tokenType: token_type
        }
    };
};

const oauthCallback = {
    path: '/oauthcallback',
    method: ['GET'],
    handler: fetchOAuthToken
};

module.exports = { oauthCallback, fetchOAuthToken };
