const { reloadAppHome, completeTasks } = require('../../utilities');
const { LoadMailing } = require('../../utilities/outreach_api/http');
const TurndownService = require('turndown');
const turndownService = new TurndownService();

const blockViewEmailTaskHomeCallback = async (payload) => {
    const { ack, action, client, body } = payload;
    console.log('blockViewEmailTaskHomeCallback body: ', body);
    console.log('blockViewEmailTaskHomeCallback: ', action);
    await ack();
    const { value } = action;
    const mailingResult = await LoadMailing(value, body.user.id);
    console.log('mailingResult: ', mailingResult);
    if (mailingResult) {
        const {
            data: { data: res }
        } = mailingResult;
        const { attributes } = res;
        const { bodyHtml, subject } = attributes || {};
        console.log('attributes: ', attributes);
        let markDown = turndownService.turndown(bodyHtml);
        // Further customizations for Slack's mrkdwn syntax
        markDown = markDown.replace(/\[(.*?)\]\((.*?)\)/g, '<$2|$1>');  // Convert links to Slack format
        markDown = markDown.replace(/\n\s*\n/g, '\n\n');

        await client.views.open({
            trigger_id: body.trigger_id,
            view: {
                type: 'modal',
                callback_id: 'email_modal',
                title: {
                    type: 'plain_text',
                    text: 'Email Modal'
                },
                blocks: [
                    {
                        type: 'input',
                        block_id: 'email_input',
                        element: {
                            type: 'plain_text_input',
                            action_id: 'email',
                            initial_value: 'amar.thondapu@outreach.io',
                            placeholder: {
                                type: 'plain_text',
                                text: 'Enter your email'
                            }
                        },
                        label: {
                            type: 'plain_text',
                            text: 'Email'
                        }
                    },
                    {
                        type: 'input',
                        block_id: 'subject_input',
                        element: {
                            type: 'plain_text_input',
                            action_id: 'subject',
                            initial_value: subject,
                            placeholder: {
                                type: 'plain_text',
                                text: 'Subject of the email'
                            }
                        },
                        label: {
                            type: 'plain_text',
                            text: 'Subject'
                        }
                    },
                    {
                        type: 'input',
                        block_id: 'message_input',
                        element: {
                            type: 'plain_text_input',
                            action_id: 'message',
                            multiline: true,
                            initial_value: markDown,
                            placeholder: {
                                type: 'plain_text',
                                text: 'Enter your message'
                            }
                        },
                        label: {
                            type: 'plain_text',
                            text: 'Message'
                        }
                    }
                ],
                submit: {
                    type: 'plain_text',
                    text: 'Send'
                }
            }
        });
    }
};

// TODO: reformat action_ids to all be snake cased
module.exports = {
    blockViewEmailTaskHomeCallback
};
