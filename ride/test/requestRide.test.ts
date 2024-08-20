import { GetRide } from "../src/application/usecase/GetRide";
import { RequestRide } from "../src/application/usecase/RequestRide";
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepository";
import { PgPromisseAdapter } from "../src/infra/database/DatabaseConnection";
import { AccountGatewayHttps } from "../src/infra/gateway/AccountGatewayHttps";
import Registry from "../src/infra/di/Registry";
import { AxiosAdapter } from "../src/infra/http/HttpClient";

test("Deve solicitar uma corrida", async function () {
    const rideRepository = new RideRepositoryDatabase(new PgPromisseAdapter());
    const accoutGateway = new AccountGatewayHttps(new AxiosAdapter());
    const inputSignUp = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
    const outputSignup = await accoutGateway.signup(inputSignUp);
    const requestRide = new RequestRide(accoutGateway, rideRepository);
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -23.5505,
        fromLong: -46.6333,
        toLat: 23.4604,
        toLong: -46.6333
    };
    const outputRequestRide = await requestRide.execute(inputRequestRide);
    expect(outputRequestRide.rideId).toBeDefined();
    Registry.getInstance().register("accountGateway", accoutGateway);
    Registry.getInstance().register("rideRepository", rideRepository);
    const getRide = new GetRide();
    const inputGetRide = {
        rideId: outputRequestRide.rideId
    };
    const outputGetRide = await getRide.execute(inputGetRide);
    expect(outputGetRide.rideId).toBe(outputRequestRide.rideId);
    expect(outputGetRide.passengerId).toBe(inputRequestRide.passengerId);
    expect(outputGetRide.fromLat).toBe(inputRequestRide.fromLat);
    expect(outputGetRide.fromLong).toBe(inputRequestRide.fromLong);
    expect(outputGetRide.toLat).toBe(inputRequestRide.toLat);
    expect(outputGetRide.toLong).toBe(inputRequestRide.toLong);
    expect(outputGetRide.status).toBe("requested");
});

test("Não deve solicitar uma corrida pois não é um passageiro", async function () {
    const rideRepository = new RideRepositoryDatabase(new PgPromisseAdapter());
    const accoutGateway = new AccountGatewayHttps(new AxiosAdapter());
    const inputSignUp = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: false
	};
    const outputSignup = await accoutGateway.signup(inputSignUp);
    const requestRide = new RequestRide(accoutGateway, rideRepository);
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -23.5505,
        fromLong: -46.6333,
        toLat: 23.4604,
        toLong: -46.6333
    };
    await expect(() => requestRide.execute(inputRequestRide)).toThrow("You must be a passenger to request a new ride.");
});

test("Não pode solicitar uma corrida se o passageiro já tiver uma corrida ativa.", async function () {
    const rideRepository = new RideRepositoryDatabase(new PgPromisseAdapter());
    const accoutGateway = new AccountGatewayHttps(new AxiosAdapter());
    const inputSignUp = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
    const outputSignup = await accoutGateway.signup(inputSignUp);
    const requestRide = new RequestRide(accoutGateway, rideRepository);
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -23.5505,
        fromLong: -46.6333,
        toLat: 23.4604,
        toLong: -46.6333
    };
    await requestRide.execute(inputRequestRide);
    await expect(() => requestRide.execute(inputRequestRide)).toThrow("This passenger already has an active ride.");
});