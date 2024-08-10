import { AccountRepository } from "../../infra/repository/AccountRepository";
import { RideRepository } from "../../infra/repository/RideRepository";

export class GetRide {

    constructor(readonly rideDAO: RideRepository, readonly accountDAO: AccountRepository) {

    }

    async execute(input: Input): Promise<Output> {
        const rideDb = await this.rideDAO.getRideById(input.rideId);
        const passenger = await this.accountDAO.getAccountById(rideDb.passengerId);
        return { 
            rideId: rideDb.rideId,
            passengerId: rideDb.passengerId,
            fromLat: rideDb.fromLat,
            fromLong: rideDb.fromLong,
            toLat: rideDb.toLat,
            toLong: rideDb.toLong,
            status: rideDb.status,
            passengerName: passenger.getName(),
            passengerEmail: passenger.getEmail()
         }
    }
}

type Input = {
    rideId: string
}

type Output = {
    rideId: string,
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    status: string,
    passengerName: string,
    passengerEmail: string
}

