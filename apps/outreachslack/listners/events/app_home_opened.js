const { reloadAppHome } = require("../../utilities");

const appHomeOpenedCallback = async ({ client, event, body, context }) => {
  // console.log("event: ", event);
  console.log("body: ", body);
  if (event.tab !== "home") {
    // Ignore the `app_home_opened` event for everything
    // except home as we don't support a conversational UI
    return;
  }
  try {
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

module.exports = { appHomeOpenedCallback };
