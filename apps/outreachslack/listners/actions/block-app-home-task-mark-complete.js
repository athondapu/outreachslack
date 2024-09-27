const {
    MARK_COMPLETE,
    MarkComplete,
    START_CHANNEL
} = require('../../utilities/outreach_api');
const { reloadAppHome } = require('../../utilities/reload-app-home');
const { size } = require('lodash');
const { errorModal } = require('../../exceptions/generic-exception');
const { successModal } = require('../../modals/success');
const { channelModals } = require('../../user-interface');
const {
    appHomeTaskStartChannelCallback
} = require('./channels/block-app-home-task-start-channel');

const appHomeTaskMarkCompleteCallback = async (payload) => {
    const reload = true;
    const { body, ack, client, context, event } = payload;
    console.log('payload: ', payload);
    const { actions, user } = body;
    const { type, selected_option } = actions[0];
    try {
        await ack();
        let selectedText = '';
        let selectedValue = '';
        if (type === 'overflow') {
            const {
                text: { text: selectedOptionText },
                value
            } = selected_option || {};
            selectedText = selectedOptionText;
            selectedValue = value;
        } else {
            const {
                text: { text },
                value
            } = actions[0];
            selectedText = text;
            selectedValue = value;
        }
        console.log('selectedText: ', selectedText);
        console.log('selectedValue: ', selectedValue);
        if (selectedText === MARK_COMPLETE) {
            const { errors, data } = await MarkComplete(selectedValue, user.id);
            console.log('errors: ', errors);
            console.log('Data: ', data);
            if (errors && size(errors) > 0) {
                const errorJson = errorModal(errors);
                await client.views.open({
                    trigger_id: body.trigger_id,
                    view: errorJson
                });
            } else {
                const { attributes } = data;
                const { action } = attributes;
                const successMessage = successModal([
                    `The current *${action}* task successfully marked as completed`
                ]);
                await client.views.open({
                    trigger_id: body.trigger_id,
                    view: successMessage
                });
            }
        } else if (selectedText === START_CHANNEL) {
            console.log('In start channel else block: ');
            await client.views.open({
                trigger_id: body.trigger_id,
                view: channelModals.newChannel(null, body.user.id)
            });
        } else {
            reload = false;
            // Need to handle/add a new view to show the message.
        }
        if (event && reload) {
            await reloadAppHome(context, client, body, user.id);
        } else if (!event) {
            const { container: {channel_id, message_ts} } = body;
            // const channelId = command.channel_id; // Channel ID where the message is
            const ts = message_ts; // Timestamp of the message you want to update
            const newText = [
                {
                    type: 'header',
                    text: {
                        type: 'plain_text',
                        text: `:white_check_mark: Task ID (${selectedValue}) marked as completed successfully`,
                        emoji: true
                    }
                }
            ]; // New message text

            try {
                // Call the chat.update method to update the message
                await client.chat.update({
                    channel: channel_id,
                    ts: ts,
                    blocks: newText
                });

            } catch (error) {
                console.error(error);
                await respond(`Failed to update message: ${error.message}`);
            }
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }
};

module.exports = {
    appHomeTaskMarkCompleteCallback
};
