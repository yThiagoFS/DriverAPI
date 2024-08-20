import Position from "../../domain/entity/Position";
import DatabaseConnection from "../database/DatabaseConnection";

export interface PositionRepository {
    getPositionsByRideId(rideId: string) : Promise<Position[]>
    savePosition(input: Position) : Promise<void>;
}

export class PositionRepositoryDatabase implements PositionRepository {

    constructor(readonly databaseConnection: DatabaseConnection) 
    {}

    async savePosition(position: Position) : Promise<void> {
        await this.databaseConnection.query("insert into db.position (position_id, ride_id, lat, long, date) values($1, $2, $3, $4, $5)", [position.positionId, position.rideId, position.coord.getLat(), position.coord.getLong(), position.date], true);
    }

    async getPositionsByRideId(rideId: string): Promise<Position[]> {
        const positionsData = await this.databaseConnection.query("select * from db.position where ride_id = $1", [rideId]);
        this.databaseConnection.close();
        const positions: Position[] = [];
        for(const positionData of positionsData) {
            const position = Position.restore(positionData.position_id, positionData.ride_id, parseFloat(positionData.lat), parseFloat(positionData.long), positionData.date);
            positions.push(position);
        }
        return positions;
    }
}