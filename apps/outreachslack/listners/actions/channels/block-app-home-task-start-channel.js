const { Modal, Blocks, Elements } = require("slack-block-builder");
const {
  MARK_COMPLETE,
  MarkComplete,
} = require("../../../utilities/outreach_api");
const reloadAppHome = require("../../../utilities/reload-app-home");
const { size } = require("lodash");
const { errorModal } = require("../../../exceptions/generic-exception");
const { successModal } = require("../../../modals/success");
const {channelModals} = require('../../../user-interface')

const appHomeTaskStartChannelModalCallback = async ({ body, ack, client }) => {
  try {
    await ack();
    await client.views.open({
      trigger_id: body.trigger_id,
      view: channelModals.newChannel(null, body.user.id),
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

const appHomeTaskStartChannelCallback = async ({ body, ack, client }) => {
  try {
    await ack();
    const {
      text: { text },
      value,
    } = actions[0];

    if (text === MARK_COMPLETE) {
      const { errors, data } = await MarkComplete(value);
      console.log("errors: ", errors);
      console.log("Data: ", data);
      if (errors && size(errors) > 0) {
        const errorJson = errorModal(errors);
        await client.views.open({
          trigger_id: body.trigger_id,
          view: errorJson,
        });
      } else {
        const { attributes } = data;
        const { action } = attributes;
        const successMessage = successModal([
          `The current *${action}* task successfully marked as completed`,
        ]);
        await client.views.open({
          trigger_id: body.trigger_id,
          view: successMessage,
        });
      }
    } else {
      // Need to implement this case
    }
    await reloadAppHome(client, body, body.view.private_metadata);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
};

module.exports = {
  appHomeTaskStartChannelCallback,
  appHomeTaskStartChannelModalCallback,
};
