import Ride from "../../domain/entity/Ride";
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
            ride.fare,
            ride.distance,
            ride.date,
            parseFloat(ride.last_lat),
            parseFloat(ride.last_long));
    }

    async hasActiveRideByPassengerId(passengerId: any): Promise<boolean> {
        const passengerHasRide: any[] = await this.databaseConnection.query("select * from db.ride where passenger_id = $1 and status <> 'completed'", [passengerId]);
        await this.databaseConnection.close();
        return !!passengerHasRide;
    }

    async saveRide(ride: Ride) : Promise<void> {
        await this.databaseConnection.query("insert into db.ride (ride_id, passenger_id, status, from_lat, from_long, to_lat, to_long, last_lat, last_long, date, distance, fare) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)", [ride.rideId, ride.passengerId, ride.getStatus(), ride.getFromLat(), ride.getFromLong(), ride.getToLat(), ride.getToLong(), ride.lastPosition.getLat(), ride.lastPosition.getLong(), ride.date, ride.distance, ride.fare]);
        await this.databaseConnection.close();
    }

    async updateRide(ride: Ride): Promise<void> {
        await this.databaseConnection.update("update db.ride set status = $1, driver_id = $2, last_lat = $3, last_long = $4, distance = $5, fare = $6 where ride_id = $7", [ride.getStatus(), ride.driverId, ride.lastPosition.getLat(), ride.lastPosition.getLong(), ride.distance, ride.fare, ride.rideId])
    }
}