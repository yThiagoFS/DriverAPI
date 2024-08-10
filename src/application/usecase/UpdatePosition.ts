import { RideRepository } from "../../infra/repository/RideRepository";

export class UpdatePosition {
    constructor(readonly rideRepository: RideRepository) {}

    async execute(input: Input) {
        
    }
}

type Input = {
    rideId: string,
    lat: string,
    long: string
}