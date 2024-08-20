import DomainEvent from "../../domain/event/DomainEvent";
import RideCompleted from "../../domain/event/RideCompleted";
import { inject } from "../../infra/di/Registry";
import Mediator from "../../infra/mediator/Mediator";
import Queue from "../../infra/queue/Queue";
import { RideRepository } from "../../infra/repository/RideRepository";
import { PaymentGateway } from "../gateway/PaymentGateway";

export default class FinishRide {
    @inject("rideRepository")
    readonly rideRepository!: RideRepository;
    @inject("paymentGateway")
    readonly paymentGateway!: PaymentGateway;
    @inject("mediator")
    readonly mediator!: Mediator
    @inject("queue")
    readonly queue!:Queue;
    
    constructor() {}

    async execute(rideId: string): Promise<void> {
        const ride = await this.rideRepository.getRideById(rideId);
        ride.register("rideCompleted", async (domainEvent: DomainEvent) => {
            await this.queue.publish(domainEvent.eventName, domainEvent.data);
        });
        ride.finish();
        await this.rideRepository.updateRide(ride);
    }
}