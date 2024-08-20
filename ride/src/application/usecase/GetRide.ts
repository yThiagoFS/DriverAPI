import { inject } from "../../infra/di/Registry";
import { PositionRepository } from "../../infra/repository/PositionRepository";
import { RideRepository } from "../../infra/repository/RideRepository";
import { AccountGateway } from "../gateway/AccountGateway";

export class GetRide {
    @inject("rideRepository")
    readonly rideRepository!: RideRepository;
    @inject("accountGateway")
    readonly accountGateway!: AccountGateway;
    
    constructor() {

    }

    async execute(input: Input): Promise<Output> {
        const rideDb = await this.rideRepository.getRideById(input.rideId);
        const passenger = await this.accountGateway.getAccountById(rideDb.passengerId);
        let driver;
        if(rideDb.driverId)
            driver = await this.accountGateway.getAccountById(rideDb.driverId);
        return { 
            rideId: rideDb.rideId,
            passengerId: rideDb.passengerId,
            fromLat: rideDb.getFromLat(),
            fromLong: rideDb.getFromLong(),
            toLat: rideDb.getToLat(),
            toLong: rideDb.getToLong(), 
            status: rideDb.getStatus(),
            passengerName: passenger.name,
            passengerEmail: passenger.email,
            driverName: driver?.name,
            driverEmail: driver?.email,
            distance: rideDb.distance,
            fare: rideDb.fare
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
    driverEmail?: string,
    distance: number,
    fare: number
}

