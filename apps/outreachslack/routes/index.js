'use strict';
const { oauthStart } = require('./oauth-start');
const { oauthCallback } = require('./oauth-callback');
const { slackEvents } = require('./slack-events');

const registerCustomRoutes = () => {
    const routes = [];
    routes.push(oauthStart);
    routes.push(oauthCallback);
    routes.push(slackEvents);
    return routes;
};

module.exports = { registerCustomRoutes };
