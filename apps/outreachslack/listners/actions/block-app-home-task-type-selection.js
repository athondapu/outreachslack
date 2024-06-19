const { reloadAppHome } = require('../../utilities/reload-app-home');

const appHomeTaskTypeSelectionCallback = async (payload) => {
    // console.log('payload: ', payload);
    const { body, ack, client, context } = payload;
    console.log('body: ', body);
    try {
        await ack();
        await reloadAppHome(context, client, body, body.user.id);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }
};

module.exports = {
    appHomeTaskTypeSelectionCallback
};
