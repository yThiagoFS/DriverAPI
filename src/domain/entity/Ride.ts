import crypto from "crypto";
import Coord from "../vo/Coord";
import Segment from "../vo/Segment";
import RideStatus, { RideStatusFactory } from "../vo/RideStatus";

export default class Ride {
    status: RideStatus; 
    fareTax: number = 2.1;
    private constructor(
        readonly rideId: string,
        readonly passengerId: string,
        public driverId: string,
        private segment: Segment,
        status: string,
        public fare: number,
        public distance: number,
        readonly date: Date,
        public lastPosition: Coord,
        ){
            this.status = RideStatusFactory.create(this, status);
    }

    static create(
        passengerId: string,
        fromLat: number,
        fromLong: number,
        toLat: number,
        toLong: number) {
        const rideId = crypto.randomUUID();
        const status = "requested";
        const date = new Date();
        const lastPosition = new Coord(fromLat, fromLong);
        return new Ride(rideId,
             passengerId,
             "",
             new Segment(new Coord(fromLat, fromLong), new Coord(toLat, toLong)),
             status,
             0,
             0,
             date,
             lastPosition
            );
    }

    static restore(
        rideId: string,
        passengerId: string,
        driverId: string,
        fromLat: number,
        fromLong: number,
        toLat: number,
        toLong: number,
        status: string,
        fare: number,
        distance: number,
        date: Date,
        lastLat: number,
        lastLong: number) {
            return new Ride(rideId,
                passengerId,
                driverId,
                new Segment(new Coord(fromLat, fromLong), new Coord(toLat, toLong)),
                status,
                fare,
                distance,
                date,
                new Coord(lastLat, lastLong));
    }

    start() {
        this.status.start();
    }

    accept(driverId: string) {
        this.status.accept();
        this.driverId = driverId;
    }

    finish() {
        this.fare = this.distance * this.fareTax;
        this.status.finish();
    }

    updatePosition(lat: number, long: number)  {
        const newPosition = new Coord(lat, long);
        const distance = new Segment(this.lastPosition, newPosition).getDistance();
        this.distance += distance;
        this.lastPosition = newPosition;
    }

    getFromLat() {
        return this.segment.from.getLat();
    }

    getFromLong() {
        return this.segment.from.getLong();
    }

    getToLat() {
        return this.segment.to.getLat();
    }

    getToLong() {
        return this.segment.to.getLong();
    }
    
    getStatus() {
        return this.status.value;
    }
}