const { channelModals } = require('../../user-interface/modals');
const { successModal } = require('../../modals/success');

const emailModalCallback = async (payload) => {
    const { ack, view, body, client } = payload;
    console.log('Email modal: ', body);
    await ack();
    // Extract data from the private_metadata
    // const metadata = JSON.parse(view.private_metadata);
    // console.log('metadata: ', metadata);
    // const { taskId } = metadata;
    // const mailingInfo = getMailingInfoByTaskId(taskId);
    // console.log('mailingInfo: ', mailingInfo);

    // const response = {
    //     data: { sendMailing: { id: '171951', __typename: 'SendMailingResult' } }
    // };

    const successMessage = successModal([
        'Email sent successfully and mailing id 171951'
    ]);
    try {
        // await ack({
        //     response_action: 'success',
        //     view: channelModals.mailSent()
        // });
        await client.views.open({
            trigger_id: body.trigger_id,
            view: successMessage
        });
        console.log('Message send successfully: ');
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }
};

module.exports = { emailModalCallback };
