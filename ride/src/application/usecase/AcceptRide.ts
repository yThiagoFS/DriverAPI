import { RideRepository } from "../../infra/repository/RideRepository";
import { AccountGateway } from "../gateway/AccountGateway";

export class AcceptRide 
{   
    constructor(readonly accountGateway: AccountGateway, readonly rideRepository: RideRepository) {

    } 

    async execute(input: Input): Promise<void> {
        const driver = await this.accountGateway.getAccountById(input.driverId);
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