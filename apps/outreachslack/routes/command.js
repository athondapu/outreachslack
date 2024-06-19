'use strict';

// Defining this route as a ExpressReceiver route as we need a param passed in
const startSlackEventProcess = async (req, res) => {
    try {
        console.log('In startSlackEventProcess: ', req.body);
        const { body } = req;
        console.log('Body: ', body);
        const { token, challenge, type } = body;
        // Store slackUserId in session
        req.session.slackUserId = req.params.slackUserId;

        // Send success message
        res.status(200).send(challenge);
    } catch (e) {
        console.error(e);
        res.writeHead(500);
        res.end('Failed to check slack events end-point', 'utf-8');
    }
};

const slackEvents = {
    path: '/ping',
    method: ['GET'],
    handler: startSlackEventProcess
};

module.exports = { slackEvents };
