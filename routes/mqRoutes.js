const express = require("express");
const router = express.Router();
const amqp = require("amqplib");

//setup proxy for server client connection with diff ports, added for deployment in local nginx
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Credentials", true);
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    next();
});

const messageHost = process.env.RABBITMQ_URL;
let messagingConnection = null;
let messagingChannel = null;
(
    async () => {
        try {
            messagingConnection = await amqp.connect(messageHost);
            messagingChannel = await messagingConnection.createChannel();
        } catch (err) {
            console.log(err);
        }
    }
)();

//
// Emit a message.
//
function emitMessage(messagingChannel, queueName, messagePayload) {
    // console.log("Sending message to queue " + queueName);
    // console.log("Payload:");
    // console.log(messagePayload);
    messagingChannel.publish("", queueName, new Buffer(JSON.stringify(messagePayload)));
}

router.post("/sendOrder", (req, res) => {
    const order = req.body;
    console.log(process.env.RABBITMQ_QUEUE_NAME);
    ( async() => {
        try {
            await emitMessage(messagingChannel, process.env.RABBITMQ_QUEUE_NAME, order);
            res.send({messageSend: success});
        } catch (err) {
            res.send(err);
        }
    })();    
})

module.exports = router;
