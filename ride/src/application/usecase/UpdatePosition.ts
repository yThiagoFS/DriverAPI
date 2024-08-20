import Position from "../../domain/entity/Position";
import { PositionRepository } from "../../infra/repository/PositionRepository";
import { RideRepository } from "../../infra/repository/RideRepository";

export class UpdatePosition {
    
    constructor(readonly rideRepository: RideRepository, readonly positionRepository: PositionRepository) {}

    async execute(input: Input) : Promise<void> {
        const ride = await this.rideRepository.getRideById(input.rideId);
        const date = new Date();
        ride.updatePosition(input.lat, input.long, date);
        await this.rideRepository.saveRide(ride);
        const position = Position.create(input.rideId, input.lat, input.long, date);
        await this.positionRepository.savePosition(position);
        await this.rideRepository.connection.commit();
    }
}

type Input = {
    rideId: string,
    lat: number,
    long: number
}