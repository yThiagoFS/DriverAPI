import { GetRide } from "../src/application/usecase/GetRide";
import { RequestRide } from "../src/application/usecase/RequestRide";
import { Signup } from "../src/application/usecase/SignUp";
import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepository";
import { MailerGatewayMemory } from "../src/infra/gateway/MailerGateway";
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepository";

test("Deve solicitar uma corrida", async function () {
    const accountDAO = new AccountRepositoryDatabase();
    const rideDAO = new RideRepositoryDatabase();
    const mailerGateway = new MailerGatewayMemory();
    const signup = new Signup(accountDAO, mailerGateway);
    const inputSignUp = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
    const outputSignup = await signup.execute(inputSignUp);
    const requestRide = new RequestRide(accountDAO, rideDAO);
    const inputRequestRide = {
        passengerId: outputSignup.accountId,
        fromLat: -23.5505,
        fromLong: -46.6333,
        toLat: 23.4604,
        toLong: -46.6333
    };
    const outputRequestRide = await requestRide.execute(inputRequestRide);
    expect(outputRequestRide.rideId).toBeDefined();
    const getRide = new GetRide(rideDAO, accountDAO);
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
    const accountDAO = new AccountRepositoryDatabase();
    const rideDAO = new RideRepositoryDatabase();
    const mailerGateway = new MailerGatewayMemory();
    const signup = new Signup(accountDAO, mailerGateway);
    const inputSignUp = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: false
	};
    const outputSignup = await signup.execute(inputSignUp);
    const requestRide = new RequestRide(accountDAO, rideDAO);
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
    const accountDAO = new AccountRepositoryDatabase();
    const rideDAO = new RideRepositoryDatabase();
    const mailerGateway = new MailerGatewayMemory();
    const signup = new Signup(accountDAO, mailerGateway);
    const inputSignUp = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
    const outputSignup = await signup.execute(inputSignUp);
    const requestRide = new RequestRide(accountDAO, rideDAO);
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