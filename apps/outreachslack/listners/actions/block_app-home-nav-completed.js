const { reloadAppHome } = require('../../utilities/reload-app-home');

const appHomeNavCompletedCallback = async ({ body, ack, client, context, event }) => {
    try {
        await ack();
        const customBody = {
          user: { id: body.event.user },
          view: { ...body.event.view },
          team: { id: body.team_id },
        };
        await reloadAppHome(context, client, customBody, event.user);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }
};

module.exports = { appHomeNavCompletedCallback };
