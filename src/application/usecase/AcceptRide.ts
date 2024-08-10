import { AccountRepository } from "../../infra/repository/AccountRepository";
import { RideRepository } from "../../infra/repository/RideRepository";

export class AcceptRide 
{   
    constructor(readonly accountRepository: AccountRepository, readonly rideRepository: RideRepository) {

    } 
    async execute(input: Input): Promise<void> {
        let driver = await this.accountRepository.getAccountById(input.driverId);
        if(!driver.isDriver) throw new Error("You must be a driver to accept a ride.");
        let ride = await this.rideRepository.getRideById(input.rideId);
        if(ride.status !== "request") throw new Error("Invalid operation: this ride cannot be accepted.");
        let driverHasRide = await this.rideRepository.hasActiveRideByDriverId(driver.accountId);
        if(driverHasRide) throw new Error("You must finish your ride to accept a new one.");
        await this.rideRepository.setDriverId(ride.rideId ,driver.accountId);
        await this.rideRepository.changeRideStatus(ride.rideId, "accepted");
    }

   
}

type Input = {
    rideId: string,
    driverId: string
}