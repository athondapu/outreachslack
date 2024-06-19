const { newChannelModalCallback } = require('./new-channel-modal');

module.exports.register = (app) => {
  app.view('new-channel-modal', newChannelModalCallback);
};
