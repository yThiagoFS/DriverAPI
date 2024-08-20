import amqp from "amqplib";

async function main() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    channel.consume("rideCompleted.processPayment", function(msg: any) {
        channel.ack(msg);
    })
} 

main();