const express = require("express");
const router = express.Router();
const amqp = require("amqplib");
const setupProxy = require("./setupProxy");
const logger = require("../logger");

//setup proxy for server client connection with diff ports, added for deployment in local nginx
router.use(setupProxy);

//CLOUDAMQP_URL is the default URL for rabbitMQ in heroku
const messageHost = process.env.CLOUDAMQP_URL || "amqp://guest:guest@localhost:5672";
let messagingConnection = null;
let messagingChannel = null;

(
    async () => {
        try {
            messagingConnection = await amqp.connect(messageHost);
            messagingChannel = await messagingConnection.createChannel();
        } catch (err) {
            logger.error(err);
        }
    }
)();

//
// Emit a message.
//
function emitMessage(messagingChannel, queueName, messagePayload) {
    // console.log(messagePayload);
    //messagingChannel.publish("", queueName, new Buffer(JSON.stringify(messagePayload)));
    messagingChannel.publish("", queueName, Buffer.from(JSON.stringify(messagePayload)));
}

router.post("/sendOrder", (req, res) => {
    const order = req.body;
    //console.log(process.env.RABBITMQ_QUEUE_NAME);
    const QUEUE_NAME = process.env.RABBITMQ_QUEUE_NAME || "myqueue";
    logger.debug(QUEUE_NAME);
    ( async() => {
        try {
            await emitMessage(messagingChannel, QUEUE_NAME, order);
            res.send({messageSend: success});
        } catch (err) {
            logger.error(err);
            res.send(err);
        }
    })();    
})

module.exports = router;
