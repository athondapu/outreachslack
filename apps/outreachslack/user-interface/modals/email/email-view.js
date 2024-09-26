const { Modal, Blocks, Elements } = require('slack-block-builder');

module.exports = (subject, markDown) => {
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
        .submit('Send')
        .buildToObject();

    // return Modal({
    //   title: "View Email",
    //   submit: "Create",
    //   callbackId: "email_modal",
    // })
    //   .blocks(
    //     Blocks.Input({ label: "New channel", blockId: "channelName" }).element(
    //       textInput(prefilledTitle)
    //     ),
    //     Blocks.Input({
    //       label: "Assign users",
    //       blockId: "channelAssignUsers",
    //     }).element(
    //       Elements.UserMultiSelect({
    //         actionId: "channelAssignUsers",
    //       })
    //     )
    //   )
    //   .buildToJSON();
};
