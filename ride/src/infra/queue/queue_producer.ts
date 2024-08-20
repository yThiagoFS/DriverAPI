import amqp from "amqplib";

async function main() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    await channel.assertExchange("rideCompleted", "direct", { durable: true });
    await channel.assertQueue("rideCompleted.processPayment", { durable:true });
    await channel.assertQueue("rideCompleted.sendReceipt", { durable:true });
    await channel.bindQueue("rideCompleted.processPayment", "rideCompleted", "");
    await channel.bindQueue("rideCompleted.sendReceipt", "rideCompleted", "");
    const input = {
        
    }
    channel.publish("rideCompleted", "", Buffer.from(JSON.stringify(input)));
} 

main();