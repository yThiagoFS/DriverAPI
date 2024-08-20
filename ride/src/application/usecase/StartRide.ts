import { RideRepository } from "../../infra/repository/RideRepository";

export class StartRide {
    
    constructor(readonly rideRepository: RideRepository) {}

    async execute(rideId: string): Promise<void> {
        let ride = await this.rideRepository.getRideById(rideId);
        ride.start();
        await this.rideRepository.updateRide(ride);
    }
}