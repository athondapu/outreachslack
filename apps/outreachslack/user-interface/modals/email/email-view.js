const { Modal, Blocks, Elements } = require('slack-block-builder');

module.exports = (subject, markDown, taskId) => {
    return Modal({ title: 'Email Modal' })
        .callbackId('email-modal')
        .blocks(
            Blocks.Input({ label: 'Email', blockId: 'email_input' }).element(
                Elements.TextInput({ actionId: 'email' })
                    .initialValue('amar.thondapu@outreach.io')
                    .placeholder('Enter your email')
            ),
            Blocks.Input({
                label: 'Subject',
                blockId: 'subject_input'
            }).element(
                Elements.TextInput({ actionId: 'subject' })
                    .initialValue(subject)
                    .placeholder('Subject of the email')
            ),
            Blocks.Input({
                label: 'Message',
                blockId: 'message_input'
            }).element(
                Elements.TextInput({ actionId: 'message' })
                    .initialValue(markDown)
                    .multiline(true)
                    .placeholder('Enter your message')
            )
        )
        .privateMetaData(
            JSON.stringify({
                taskId: taskId // Include extra data here
            })
        )
        .submit('Send')
        .buildToObject();
};
