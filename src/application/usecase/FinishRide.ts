import { PositionRepository } from "../../infra/repository/PositionRepository";
import { RideRepository } from "../../infra/repository/RideRepository";


export default class FinishRide {

    constructor(readonly rideRepository: RideRepository) {}

    async execute(rideId: string): Promise<void> {
        const ride = await this.rideRepository.getRideById(rideId);
        ride.finish();
        await this.rideRepository.updateRide(ride);
    }
}