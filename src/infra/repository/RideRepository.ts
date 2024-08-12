import Ride from "../../domain/Ride";
import DatabaseConnection from "../database/DatabaseConnection";

export interface RideRepository {
    getRideById(rideId: string) : Promise<Ride>
    hasActiveRideByPassengerId(passengerId: string) : Promise<any>;
    saveRide(input: Ride) : Promise<void>;
    updateRide(input: Ride) : Promise<void>;
}

export class RideRepositoryDatabase implements RideRepository {

    constructor(readonly databaseConnection: DatabaseConnection) 
    {}

    async getRideById(rideId: string): Promise<Ride> {
        const [ride] = await this.databaseConnection.query("select * from db.ride where ride_id = $1", [rideId]);
        await this.databaseConnection.close();
        return Ride.restore(ride.ride_id,
             ride.passenger_id,
             ride.rideId,
             parseFloat(ride.from_lat), 
             parseFloat(ride.from_Long), 
             parseFloat(ride.to_lat), 
             parseFloat(ride.to_Long), 
             ride.status, 
             ride.date);
    }

    async hasActiveRideByPassengerId(passengerId: any): Promise<boolean> {
        const passengerHasRide: any[] = await this.databaseConnection.query("select * from db.ride where passenger_id = $1 and status <> 'completed'", [passengerId]);
        await this.databaseConnection.close();
        return !!passengerHasRide;
    }

    async saveRide(ride: Ride) : Promise<void> {
        await this.databaseConnection.query("insert into db.ride (ride_id, passenger_id, status, from_lat, from_long, to_lat, to_long, date) values($1, $2, $3, $4, $5, $6, $7, $8)", [ride.rideId, ride.passengerId, ride.getStatus(), ride.getFromLat(), ride.getFromLong(), ride.getToLat(), ride.getToLong(), ride.date]);
        await this.databaseConnection.close();
    }

    async updateRide(ride: Ride): Promise<void> {
        await this.databaseConnection.update("update db.ride set status = $1, driver_id = $2 where ride_id = $3", [ride.getStatus(), ride.driverId, ride.rideId])
    }
}