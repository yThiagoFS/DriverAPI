import { AccountDAO } from "../resources/AccountDAO";
import { RideDAO } from "../resources/RideDAO";
import crypto from "crypto";

export class RequestRide {
    
    constructor(readonly accountDAO: AccountDAO,  readonly rideDAO: RideDAO) {

    }

    async execute(input: any) : Promise<any> {
        const passenger = await this.accountDAO.getAccountById(input.accountId);
        if(!passenger.isPassenger) throw new Error("You must be a passenger to request a new ride.");
        const passengerHasRide = await this.rideDAO.passengerHasRide(input.accountId);
        if(!passengerHasRide) throw new Error("You're not availiable to request a ride right now. Try againt later.");
        const ride = {
            rideId: crypto.randomUUID(),
            passengerId: input.passengerId,
            status: "requested",
            date: new Date().getUTCDate(),
            fromLat: input.fromLat,
            fromLong: input.fromLong,
            toLat: input.toLat,
            toLong: input.toLong
        };
        await this.rideDAO.saveRide(ride);
        return ride.rideId;
    }

}