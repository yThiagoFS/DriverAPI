import { GetRide } from "../src/application/usecase/GetRide";
import { RequestRide } from "../src/application/usecase/RequestRide";
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepository";
import { PgPromisseAdapter, UnitOfWork } from "../src/infra/database/DatabaseConnection";
import { AcceptRide } from "../src/application/usecase/AcceptRide";
import { StartRide } from "../src/application/usecase/StartRide";
import { UpdatePosition } from "../src/application/usecase/UpdatePosition";
import { PositionRepositoryDatabase } from "../src/infra/repository/PositionRepository";
import FinishRide from "../src/application/usecase/FinishRide";
import { PaymentGatewayHttp } from "../src/infra/gateway/PaymentGatewayHttp";
import Registry from "../src/infra/di/Registry";
import { AccountGatewayHttps } from "../src/infra/gateway/AccountGatewayHttps";
import { FetchAdapter } from "../src/infra/http/HttpClient";
import Mediator from "../src/infra/mediator/Mediator";
import { RabbitMQAdapter } from "../src/infra/queue/Queue";

test("Deve finalizar uma corrida", async function () {
	const connection = new PgPromisseAdapter();
	const rideRepository = new RideRepositoryDatabase(connection);
	const accountGateway = new AccountGatewayHttps(new FetchAdapter());
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const outputSignup = await accountGateway.signup(inputSignup);
	const inputSignupDriver = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		carPlate: "AAA9999",
		isDriver: true
	};
	const outputSignupDriver = await accountGateway.signup(inputSignupDriver);
	const requestRide = new RequestRide(accountGateway, rideRepository);
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	}
	const outputRequestRide = await requestRide.execute(inputRequestRide);
	const acceptRide = new AcceptRide(accountGateway, rideRepository);
	const inputAcceptRide = {
		rideId: outputRequestRide.rideId,
		driverId: outputSignupDriver.accountId
	};
	await acceptRide.execute(inputAcceptRide);
	const startRide = new StartRide(rideRepository);
	await startRide.execute(outputRequestRide.rideId);
	const unitOfWork = new UnitOfWork();
	const rideRepositoryUoW = new RideRepositoryDatabase(unitOfWork);
	const positionRepositoryUoW = new PositionRepositoryDatabase(unitOfWork);
	const updatePosition = new UpdatePosition(rideRepositoryUoW, positionRepositoryUoW);
	const inputUpdatePosition1 = { 
		rideId: outputRequestRide.rideId,
		lat: -27.584905257808835,
		long: -48.545022195325124
	};
	await updatePosition.execute(inputUpdatePosition1);
	const inputUpdatePosition2 = { 
		rideId: outputRequestRide.rideId,
		lat: -27.496887588317275,
		long: -48.522234807851476
	};
	await updatePosition.execute(inputUpdatePosition2);
	const getRide = new GetRide();
	const inputGetRide = {
		rideId: outputRequestRide.rideId
	};
	Registry.getInstance().register("rideRepository", rideRepository);
	Registry.getInstance().register("paymentGateway", new PaymentGatewayHttp());
	const mediator = new Mediator();
	mediator.register("rideCompleted", async (data: any) => {
		// mediator logic...
	});
	const queue = new RabbitMQAdapter();
	await queue.connect();
	Registry.getInstance().register("queue", queue);
	Registry.getInstance().register("mediator", mediator);
	const finishRide = new FinishRide();
	await finishRide.execute(outputRequestRide.rideId);
	const outputGetRide = await getRide.execute(inputGetRide);
	expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
	expect(outputGetRide.fare).toBe(21);
	expect(outputGetRide.status).toBe("completed");
	await connection.close();
	await unitOfWork.close();
});