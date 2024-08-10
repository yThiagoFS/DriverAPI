import { RideRepository } from "../../infra/repository/RideRepository";

export class StartRide {
    constructor(readonly rideRepository: RideRepository) {}

    async execute(rideId: string): Promise<void> {
        let ride = await this.rideRepository.getRideById(rideId);
        if(ride.status !== "accepted") throw new Error("Ride must be accepted to start.");
        await this.rideRepository.changeRideStatus(ride.rideId, "in_progress")
    }
}