export default class Coord {
    private lat: number;
    private long: number;

    constructor(lat: number, long: number) {
        if(lat < -90 || lat > 90) throw new Error("Invalid latitute.");
        if(long < -180 || long > 180) throw new Error("Invalid longitute.");
        this.lat = lat;
        this.long = long;
    }

    getLat() {
        return this.lat;
    }

    getLong() {
        return this.long;
    }
}