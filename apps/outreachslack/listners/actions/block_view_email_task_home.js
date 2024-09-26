const emailView = require('../../user-interface/modals/email/email-view');
const { reloadAppHome, completeTasks } = require('../../utilities');
const { LoadMailing } = require('../../utilities/outreach_api/http');
const TurndownService = require('turndown');
const { popultaeTaskIdVsMailingInfo } = require('../../utilities/utils');
const turndownService = new TurndownService();

const blockViewEmailTaskHomeCallback = async (payload) => {
    const { ack, action, client, body } = payload;
    console.log('blockViewEmailTaskHomeCallback body: ', body);
    console.log('blockViewEmailTaskHomeCallback: ', action);
    await ack();
    const { value } = action;
    const mailingResult = await LoadMailing(value, body.user.id);
    console.log('mailingResult: ', JSON.stringify(mailingResult));
    if (mailingResult) {
        const {
            data: { data: res }
        } = mailingResult;
        const { attributes, relationships, id } = res;
        const { bodyHtml, bodyText, subject, mailboxAddress } =
            attributes || {};
        const {
            prospect: {
                data: { id: prospectId }
            },
            mailbox: {
                data: { id: mailboxId }
            },
            task: {
                data: { id: taskId }
            },
            template: {
                data: { id: templateId }
            }
        } = relationships || {};
        console.log('attributes: ', attributes);
        let markDown = turndownService.turndown(bodyHtml);
        // Further customizations for Slack's mrkdwn syntax
        markDown = markDown.replace(/\[(.*?)\]\((.*?)\)/g, '<$2|$1>'); // Convert links to Slack format
        markDown = markDown.replace(/\n\s*\n/g, '\n\n');

        console.log('Email View: ', emailView);
        const extraData = {
            bodyHtml,
            bodyText,
            from: { email: mailboxAddress },
            id,
            mailboxId,
            opportunityAssociationRule: 'noop',
            overrideSafetySettings: false,
            prospectId,
            subject,
            taskId,
            templateId,
            to: [
                {
                    email: 'julie.mccabe@alteryx.com',
                    name: 'Julie Mccabe',
                    primary: true,
                    prospectId: '186908',
                    value: 'Julie Mccabe <julie.mccabe@alteryx.com>'
                }
            ],
            trackLinks: false,
            trackOpens: true
        };
        popultaeTaskIdVsMailingInfo(taskId, extraData);
        // Open the modal using the Slack client
        await client.views.open({
            trigger_id: body.trigger_id,
            view: emailView(subject, markDown, taskId)
        });
    }
};

// TODO: reformat action_ids to all be snake cased
module.exports = {
    blockViewEmailTaskHomeCallback
};
