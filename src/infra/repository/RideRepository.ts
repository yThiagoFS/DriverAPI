import pgp from "pg-promise";
import Ride from "../../domain/Ride";

export interface RideRepository {
    getRideById(rideId: string) : Promise<Ride>
    hasActiveRideByPassengerId(passengerId: string) : Promise<any>;
    saveRide(input: Ride) : Promise<void>;
}

export class RideRepositoryDatabase implements RideRepository {

    async getRideById(rideId: string): Promise<Ride> {
        const connection = pgp()("postgress://postgress:123456@localhost:5432/app");    
        const [ride] = await connection.query("select * from db.ride where ride_id = $1", [rideId]);
        await connection.$pool.end();
        return Ride.restore(ride.ride_id,
             ride.passenger_id,
             parseFloat(ride.from_lat), 
             parseFloat(ride.from_Long), 
             parseFloat(ride.to_lat), 
             parseFloat(ride.to_Long), 
             ride.status, 
             ride.date);
    }

    async hasActiveRideByPassengerId(passengerId: any): Promise<boolean> {
        const connection = pgp()("postgress://postgress:123456@localhost:5432/app");    
        const passengerHasRide: any[] = await connection.query("select * from db.ride where passenger_id = $1 and status <> 'completed'", [passengerId]);
        await connection.$pool.end();
        return !!passengerHasRide;
    }

    async saveRide(input: Ride) : Promise<void> {
        const connection = pgp()("postgress://postgress:123456@localhost:5432/app");   
        await connection.query("insert into db.ride (ride_id, passenger_id, status, from_lat, from_long, to_lat, to_long, date) values($1, $2, $3, $4, $5, $6, $7, $8)", [input.rideId, input.passengerId, input.status, input.fromLat, input.fromLong, input.toLat, input.toLong, input.date]);
        await connection.$pool.end();
    }

}