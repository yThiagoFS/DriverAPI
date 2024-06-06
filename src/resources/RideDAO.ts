import pgp from "pg-promise";

export interface RideDAO {
    getRideById(rideId: string) : Promise<any>
    passengerHasRide(input: any) : Promise<any>;
    saveRide(input: any) : Promise<void>;
}

export class RideDAODatabase implements RideDAO {

    async getRideById(rideId: string): Promise<any> {
        const connection = pgp()("postgress://postgress:123456@localhost:5432/app");    
        const ride = await connection.query("select * from db.ride where ride_id = $1", [rideId]);
        await connection.$pool.end();
        return ride;
    }

    async passengerHasRide(passengerId: any): Promise<any> {
        const connection = pgp()("postgress://postgress:123456@localhost:5432/app");    
        const passengerRides: any[] = await connection.query("select * from db.ride where passenger_id = $1", [passengerId]);
        await connection.$pool.end();
        return passengerRides.find(ride => ride.status !== "completed");
    }

    async saveRide(input: any) : Promise<void> {
        const connection = pgp()("postgress://postgress:123456@localhost:5432/app");   
        await connection.query("insert into db.ride (ride_id, passenger_id, status, from_lat, from_long, to_lat, to_long, date) values($1, $2, $3, $4, $5, $6, $7, $8)", [input.rideId, input.passengerId, input.status, input.fromLat, input.fromLong, input.toLat, input.toLong, input.date]);
        await connection.$pool.end();
    }

}