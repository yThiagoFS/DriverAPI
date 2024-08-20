import express from "express";
import { GetRide } from "./application/usecase/GetRide";
import Registry from "./infra/di/Registry";
import { PgPromisseAdapter } from "./infra/database/DatabaseConnection";
import { RideRepositoryDatabase } from "./infra/repository/RideRepository";
import { PositionRepositoryDatabase } from "./infra/repository/PositionRepository";
import { AccountGatewayHttps } from "./infra/gateway/AccountGatewayHttps";
const app = express();
app.use(express.json());

app.get("https://localhost:3000/ride/:rideId", async function (req, res) {
    const dbConnection = new PgPromisseAdapter();
    Registry.getInstance().register("rideRepository", new RideRepositoryDatabase(dbConnection));
    Registry.getInstance().register("positionsRepository", new PositionRepositoryDatabase(dbConnection));
    Registry.getInstance().register("accountGateway", new AccountGatewayHttps());
    const getRide = new GetRide();
    return res.json(await getRide.execute({rideId: req.params.rideId}));
})

app.listen(3000);