import { RideRepository } from "../../infra/repository/RideRepository";
import Ride from "../../domain/entity/Ride";
import { AccountGateway } from "../gateway/AccountGateway";

export class RequestRide {
    
    constructor(readonly accountGateway: AccountGateway,  readonly rideDAO: RideRepository){ 

    }

    async execute(input: Input) : Promise<Output> {
        const passenger = await this.accountGateway.getAccountById(input.passengerId);
        if(!passenger.isPassenger) throw new Error("You must be a passenger to request a new ride.");
        const passengerHasRide = await this.rideDAO.hasActiveRideByPassengerId(input.passengerId);
        if(passengerHasRide) throw new Error("This passenger already has an active ride.");
        const ride = Ride.create(
        input.passengerId,
        input.fromLat,
        input.fromLong,
        input.toLat,
        input.toLong);
        await this.rideDAO.saveRide(ride);
        return  {
            rideId: ride.rideId
        };
    }

}

type Input = {
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number
}

type Output = {
    rideId: string
}