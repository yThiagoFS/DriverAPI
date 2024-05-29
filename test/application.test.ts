import { GetAccount } from "../src/application/getAccount";
import { Signup } from "../src/application/signup";
import { AccountDAOInMemoryDatabase } from "../src/resources/AccountDAO";
import { MailerGatewayMemory } from "../src/resources/MailerGateway";

let signup: Signup;
let getAccount: GetAccount;
const accountDAO = new AccountDAOInMemoryDatabase();
const mailerGateway = new MailerGatewayMemory();

beforeEach(async () => {
	signup = new Signup(accountDAO, mailerGateway);
	getAccount = new GetAccount(accountDAO);
});

test("Deve criar uma conta para o passageiro", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const outputSignup = await signup.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	expect(outputGetAccount.isPassenger).toBe(true);
});

test("Não deve criar uma conta para o passageiro se o nome for inválido", async function () {
	const input = {
		name: "John",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	expect(async () => await signup.execute(input)).toThrow("Invalid Name.");
});

test("Deve criar uma conta para o motorista", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		carPlate: "AAA9999",
		isPassenger: false,
		isDriver: true
	};
	const outputSignup = await signup.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	expect(outputGetAccount.isPassenger).toBe(false);
	expect(outputGetAccount.isDriver).toBe(false);
	expect(outputGetAccount.carPlate).toBe(input.carPlate);
});