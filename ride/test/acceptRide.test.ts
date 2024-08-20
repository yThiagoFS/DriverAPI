import { GetRide } from "../src/application/usecase/GetRide";
import { RequestRide } from "../src/application/usecase/RequestRide";
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepository";
import { PgPromisseAdapter } from "../src/infra/database/DatabaseConnection";
import { AcceptRide } from "../src/application/usecase/AcceptRide";
import { AccountGatewayHttps } from "../src/infra/gateway/AccountGatewayHttps";
import { AxiosAdapter } from "../src/infra/http/HttpClient";

test("Deve aceitar uma corrida", async function () {
	const connection = new PgPromisseAdapter();
	const rideRepository = new RideRepositoryDatabase(connection);
	const accoutGateway = new AccountGatewayHttps(new AxiosAdapter());
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const outputSignup = await accoutGateway.signup(inputSignup);
	const inputSignupDriver = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		carPlate: "AAA9999",
		isDriver: true
	};
	const outputSignupDriver = await accoutGateway.signup(inputSignupDriver);
	const requestRide = new RequestRide(accoutGateway, rideRepository);
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -27.584905257808835,
		fromLong: -48.545022195325124,
		toLat: -27.496887588317275,
		toLong: -48.522234807851476
	}
	const outputRequestRide = await requestRide.execute(inputRequestRide);
	const acceptRide = new AcceptRide(accoutGateway, rideRepository);
	const inputAcceptRide = {
		rideId: outputRequestRide.rideId,
		driverId: outputSignupDriver.accountId
	};
	await acceptRide.execute(inputAcceptRide);
	const getRide = new GetRide();
	const inputGetRide = {
		rideId: outputRequestRide.rideId
	};
	const outputGetRide = await getRide.execute(inputGetRide);
	expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
	expect(outputGetRide.status).toBe("accepted");
	expect(outputGetRide.driverName).toBe("John Doe");
	await connection.close();
});