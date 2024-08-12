import { AccountRepository } from "../../infra/repository/AccountRepository";
import { RideRepository } from "../../infra/repository/RideRepository";

export class AcceptRide 
{   
    constructor(readonly accountRepository: AccountRepository, readonly rideRepository: RideRepository) {

    } 

    async execute(input: Input): Promise<void> {
        const driver = await this.accountRepository.getAccountById(input.driverId);
        if(!driver.isDriver) throw new Error("You must be a driver to accept a ride.");
        const ride = await this.rideRepository.getRideById(input.rideId);
        ride.accept(input.driverId);
        await this.rideRepository.updateRide(ride);
    }
   
}

type Input = {
    rideId: string,
    driverId: string
}