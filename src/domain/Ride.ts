import crypto from "crypto";
import Coord from "./Coord";
import Segment from "./Segment";
import RideStatus, { RideStatusFactory } from "./RideStatus";

export default class Ride {
    status: RideStatus; 

    private constructor(
        readonly rideId: string,
        readonly passengerId: string,
        public driverId: string,
        private segment: Segment,
        status: string,
        readonly date: Date){
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
        return new Ride(rideId,
             passengerId,
             "",
             new Segment(new Coord(fromLat, fromLong), new Coord(toLat, toLong)),
             status,
             date);
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
        date: Date) {
            return new Ride(rideId,
                passengerId,
                driverId,
                new Segment(new Coord(fromLat, fromLong), new Coord(toLat, toLong)),
                status,
                date);
    }

    start() {
        this.status.start();
    }

    accept(driverId: string) {
        this.status.accept();
        this.driverId = driverId;
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

    getDistance() {
        return this.segment.getDistance();
    }

    getStatus() {
        return this.status.value;
    }
}