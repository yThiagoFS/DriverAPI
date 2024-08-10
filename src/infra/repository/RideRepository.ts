import pgp from "pg-promise";
import Ride from "../../domain/Ride";
import DatabaseConnection from "../database/DatabaseConnection";

export interface RideRepository {
    getRideById(rideId: string) : Promise<Ride>
    hasActiveRideByPassengerId(passengerId: string) : Promise<any>;
    hasActiveRideByDriverId(driverId: string) : Promise<any>;
    saveRide(input: Ride) : Promise<void>;
    setDriverId(rideId: string, driverId: string) : Promise<void>;
    changeRideStatus(rideId: string, status: string) : Promise<void>;
}

export class RideRepositoryDatabase implements RideRepository {

    constructor(readonly databaseConnection: DatabaseConnection) 
    {}

    async getRideById(rideId: string): Promise<Ride> {
        const [ride] = await this.databaseConnection.query("select * from db.ride where ride_id = $1", [rideId]);
        await this.databaseConnection.close();
        return Ride.restore(ride.ride_id,
             ride.passenger_id,
             parseFloat(ride.from_lat), 
             parseFloat(ride.from_Long), 
             parseFloat(ride.to_lat), 
             parseFloat(ride.to_Long), 
             ride.status, 
             ride.date);
    }

    async hasActiveRideByDriverId(driverId: any): Promise<boolean> {
        const connection = pgp()("postgress://postgress:123456@localhost:5432/app");    
        const driverHasRide: any[] = await connection.query("select * from db.ride where driver_id = $1 and status = 'accepted' or status = 'in_progress'", [driverId]);
        await connection.$pool.end();
        return !!driverHasRide;
    }

    async hasActiveRideByPassengerId(passengerId: any): Promise<boolean> {
        const passengerHasRide: any[] = await this.databaseConnection.query("select * from db.ride where passenger_id = $1 and status <> 'completed'", [passengerId]);
        await this.databaseConnection.close();
        return !!passengerHasRide;
    }

    async saveRide(input: Ride) : Promise<void> {
        await this.databaseConnection.query("insert into db.ride (ride_id, passenger_id, status, from_lat, from_long, to_lat, to_long, date) values($1, $2, $3, $4, $5, $6, $7, $8)", [input.rideId, input.passengerId, input.status, input.fromLat, input.fromLong, input.toLat, input.toLong, input.date]);
        await this.databaseConnection.close();
    }

    async setDriverId(rideId: string, driverId: string): Promise<void> {
        await this.databaseConnection.update("update db.ride set driver_id = $1 where ride_id = $2", [driverId, rideId]);
    }

    async changeRideStatus(rideId: string, status: string): Promise<void> {
        await this.databaseConnection.update("update db.ride set status = $1 where ride_id = $2", [status, rideId]);
    }

}