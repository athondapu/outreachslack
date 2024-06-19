'use strict';
const { HomeTab, Actions, Elements, Blocks } = require('slack-block-builder');

const authorizationScreen = (authUrl) => {
    console.log("authurl:", authUrl);
    const homeTab = HomeTab({
        callbackId: 'authorize-outreach',
        privateMetaData: 'authorization-screen'
    }).blocks(
        Blocks.Header({ text: 'Connect to Outreach' }),
        Blocks.Divider(),
        Blocks.Section({
            text: 'To get started with Task App, authorize with Outreach'
        }),
        Actions({ blockId: 'outreach-login' }).elements(
            Elements.Button({ text: 'Authorize with Outreach' })
                .value('authorize-with-outreach')
                .actionId('authorize-with-outreach')
                .url(authUrl)
                .primary(true)
        )
    );
    return homeTab.buildToJSON();
};

module.exports = { authorizationScreen };
