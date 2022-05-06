const amqp = require("amqplib");
const axios = require("axios");
const {retry} = require("./retry");
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

async function consumeMessages(messagingChannel, queueName, handler) {
    
    function consumeCallback(msg) {
        console.log("Handling" + queueName);
        const messagePayload = JSON.parse(msg.content.toString());
        
        try {
            const promise = handler(messagePayload);
            if (promise) {
                promise.then(() => {
                        messagingChannel.ack(msg); //TODO: Need to understand how ack works.
                        console.log(queueName + " async handler done.");
                    })
                    .catch(err => {
                        console.error(queueName + " async handler errored.");
                        console.error(err && err.stack || err);
                    });
            }
            else {
                messagingChannel.ack(msg);
                console.log(queueName + " handler done.");
            }
        }
        catch (err) {
            console.error(queueName + " handler errored.");
            console.error(err && err.stack || err);
        }
    };

    console.log("Receiving messages for queue " + queueName);
    await messagingChannel.consume(queueName, consumeCallback);
};

// async function main() {
//     const messageHost = process.env.RABBITMQ_URL;
//     const queueName = process.env.RABBITMQ_QUEUE_NAME || "myqueue"

//     const messagingConnection = await retry( () => amqp.connect(messageHost), 10, 5000);
//     const messagingChannel = await messagingConnection.createChannel();
//     await messagingChannel.assertQueue(queueName, {});
          
//     await consumeMessages(messagingChannel, queueName,
//         messagePayload => {
//             console.log("Received message on my-queue.");
//             console.log("Payload: ");
//             console.log(messagePayload);
//         }
//     );
// };

const processOrder = async(messagePayload) => {
    try {
         //console.log(messagePayload);
         const ENDPOINT = process.env.REACT_APP_API_ENDPOINT || "http://localhost:3001/";
         const res = await axios.post(`${ENDPOINT}product/amends`, messagePayload);
         //if no purchased records are processed, refund the order
         if (res.data.length === 0) {
            console.log("call refund");
            await axios.post(`${ENDPOINT}order/status/refund`, messagePayload);
         } else {
            console.log("call confirm");
            await axios.post(`${ENDPOINT}order/status/confirm`, messagePayload);
         }
         
    } catch (err) {
        console.log(err);
    }
}

(
    async()=> {
        try {
            //CLOUDAMQP_URL is the default URL for rabbitMQ in Heroku
            const messageHost = process.env.CLOUDAMQP_URL || "amqp://guest:guest@localhost:5672";
            const queueName = process.env.RABBITMQ_QUEUE_NAME || "myqueue"
            
            const messagingConnection = await retry( () => amqp.connect(messageHost), 10, 5000);
            const messagingChannel = await messagingConnection.createChannel();
            await messagingChannel.assertQueue(queueName, {});
                
            await consumeMessages(messagingChannel, queueName,
                messagePayload => {
                    processOrder(messagePayload);
                }
            );
            
            console.log("online");
        } catch (err) {
            console.log(err);
        }
    }
) (); 


/**
exports.startProcessor = async () => {
    try {
        //CLOUDAMQP_URL is the default URL for rabbitMQ in Heroku
        const messageHost = process.env.CLOUDAMQP_URL || "amqp://guest:guest@localhost:5672";
        const queueName = process.env.RABBITMQ_QUEUE_NAME || "myqueue"
        
        const messagingConnection = await retry( () => amqp.connect(messageHost), 10, 5000);
        const messagingChannel = await messagingConnection.createChannel();
        await messagingChannel.assertQueue(queueName, {});
            
        await consumeMessages(messagingChannel, queueName,
            messagePayload => {
                console.log(messagePayload);
                processOrder(messagePayload);
            }
        );
        
        console.log("online");
    } catch (err) {
        console.log(err);
    }
}
 */
