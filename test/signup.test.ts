import Account from "../src/domain/Account";
import { GetAccount } from "../src/application/usecase/GetAccount";
import { Signup } from "../src/application/usecase/SignUp";
import { AccountRepositoryDatabase, AccountDAOInMemoryDatabase } from "../src/infra/repository/AccountRepository";
import { MailerGatewayMemory } from "../src/infra/gateway/MailerGateway";
import sinon from "sinon";

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

//STUB
test("Deve criar uma conta para o com STUB", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const saveAccountStub = sinon.stub(AccountRepositoryDatabase.prototype, "saveAccount").resolves();
	const getAccountByEmailStub = sinon.stub(AccountRepositoryDatabase.prototype, "getAccountByEmail").resolves(null);
	const getAccountByIdStub = sinon.stub(AccountRepositoryDatabase.prototype, "getAccountById").resolves(Account.restore("", input.name, input.email, input.cpf, "", true, false));
	const accountDAODB = new AccountRepositoryDatabase();
	const mailerGateway = new MailerGatewayMemory();
	signup = new Signup(accountDAODB, mailerGateway);
	getAccount = new GetAccount(accountDAODB);
	const outputSignup = await signup.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	expect(outputGetAccount.isPassenger).toBe(true);
	saveAccountStub.restore();
	getAccountByEmailStub.restore();
	getAccountByIdStub.restore();
});

//SPY
test("Deve criar uma conta para o com SPY", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const sendSpy = sinon.spy(MailerGatewayMemory.prototype, "send");
	const outputSignup = await signup.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	expect(outputGetAccount.isPassenger).toBe(true);
	expect(sendSpy.calledOnce).toBe(true);
	expect(sendSpy.calledWith(input.email, "Account created.", "Your account has been created."));
	sendSpy.restore();
});

//Mock
test("Deve criar uma conta para o com MOCK", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const sendMock = sinon.mock(MailerGatewayMemory.prototype);
	sendMock.expects("send").withArgs(input.email, "Account created.", "Your account has been created.").once;
	const outputSignup = await signup.execute(input);
	expect(outputSignup.accountId).toBeDefined();
	const outputGetAccount = await getAccount.execute(outputSignup);
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	expect(outputGetAccount.isPassenger).toBe(true);
	sendMock.verify();
	sendMock.restore();
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

test.each([
    "11111111111",
    "0123456789010",
    "0123456"
])("Não deve criar uma conta para o passageiro se o cpf for inválido", async function (cpf: string) {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: cpf,
		isPassenger: true
	};
	expect(async () => await signup.execute(input)).toThrow("Invalid Name.");
});

test.each(["abc@", "aaaa", "@gm", "email@com"])("Não deve criar uma conta para o passageiro se o email for inválido", async function (email: string) {
	const input = {
		name: "John Doe",
		email: email,
		cpf: "87748248800",
		isPassenger: true
	};
	expect(async () => await signup.execute(input)).toThrow("Invalid Email.");
});

test("Não deve criar uma conta para o passageiro se o email já existe", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	expect(async () => await signup.execute(input)).toThrow("Invalid Email.");
});

test.each([
    "11111111111",
    "0123456789010",
    "0123456"
])("Não deve criar uma conta para o motorista se a placa for inválida", async function (cpf: string) {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		carPlate: "AA999",
		isPassenger: false,
		isDriver: true
	};
	expect(async () => await signup.execute(input)).toThrow("Invalid Email.");
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