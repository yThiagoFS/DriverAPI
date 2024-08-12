import { AccountRepository } from "../../infra/repository/AccountRepository";
import { RideRepository } from "../../infra/repository/RideRepository";

export class GetRide {

    constructor(readonly rideDAO: RideRepository, readonly accountDAO: AccountRepository) {

    }

    async execute(input: Input): Promise<Output> {
        const rideDb = await this.rideDAO.getRideById(input.rideId);
        const passenger = await this.accountDAO.getAccountById(rideDb.passengerId);
        let driver;
        if(rideDb.driverId)
            driver = await this.accountDAO.getAccountById(rideDb.driverId);
        return { 
            rideId: rideDb.rideId,
            passengerId: rideDb.passengerId,
            fromLat: rideDb.getFromLat(),
            fromLong: rideDb.getFromLong(),
            toLat: rideDb.getToLat(),
            toLong: rideDb.getToLong(), 
            status: rideDb.getStatus(),
            passengerName: passenger.getName(),
            passengerEmail: passenger.getEmail(),
            driverName: driver?.getName(),
            driverEmail: driver?.getEmail()
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
    passengerEmail: string,
    driverName?: string,
    driverEmail?: string
}

