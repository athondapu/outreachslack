const { emailModalCallback } = require('./email-modal');
const { newChannelModalCallback } = require('./new-channel-modal');

module.exports.register = (app) => {
  app.view('new-channel-modal', newChannelModalCallback);
  app.view('email-modal', emailModalCallback);
};
