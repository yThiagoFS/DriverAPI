import express from "express";
import ProcessPayment from "./application/usecase/ProcessPayment";
import { RabbitMQAdapter } from "./infra/queue/Queue";
const app = express();
app.use(express.json());

async function main() {
    const queue = new RabbitMQAdapter()
    await queue.connect()
    await queue.consume("rideCompleted.processPayment", async(input: any) => {
        const processPayment = new ProcessPayment();
        processPayment.execute(input);
    });
    app.listen(3002);
    
    app.listen(3001);
}
