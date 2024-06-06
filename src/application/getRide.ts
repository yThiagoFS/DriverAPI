import { AccountDAO } from "../resources/AccountDAO";
import { RideDAO } from "../resources/RideDAO";

export class getRide {

    constructor(readonly rideDAO: RideDAO, readonly accountDAO: AccountDAO) {

    }

    async execute(rideId: string) {
        const rideDb = await this.rideDAO.getRideById(rideId);
        const passenger = await this.accountDAO.getAccountById(rideDb.ride_id);
        const driver = null;
        return { 
            ride: rideDb, 
            passenger: { name: passenger.name, email: passenger.email },
            driver: driver }
    }
}