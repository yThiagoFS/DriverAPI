import axios from "axios";

axios.defaults.validateStatus = function () {
	return true;
}

test("Deve criar uma conta para o passageiro", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const responseSignup = await axios.post("http://localhost:3000/signup", input);
	expect(responseSignup.status).toBe(200);
	const outputSignup = responseSignup.data;
	expect(outputSignup.accountId).toBeDefined();
	const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
	const outputGetAccount = responseGetAccount.data;
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
	const responseSignup =  await axios.post("http://localhost:3000/signup", input);
	expect(responseSignup.status).toBe(422);
	expect(responseSignup.data.message).toBe("Invalid Name.");
});

test.each(["abc@", "aaaa", "@gm", "email@com"])("Não deve criar uma conta para o passageiro se o email for inválido", async function (email: string) {
	const input = {
		name: "John Doe",
		email: email,
		cpf: "87748248800",
		isPassenger: true
	};
	const responseSignup =  await axios.post("http://localhost:3000/signup", input);
	expect(responseSignup.status).toBe(422);
	expect(responseSignup.data.message).toBe("Invalid Email.");
});

test("Não deve criar uma conta para o passageiro se o email já existe", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	await axios.post("http://localhost:3000/signup", input);
	const responseSignup =  await axios.post("http://localhost:3000/signup", input);
	expect(responseSignup.status).toBe(422);
	expect(responseSignup.data.message).toBe("Account already exists.");
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
	const responseSignup =  await axios.post("http://localhost:3000/signup", input);
	expect(responseSignup.status).toBe(422);
	expect(responseSignup.data.message).toBe("Invalid CPF.");
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
	const responseSignup =  await axios.post("http://localhost:3000/signup", input);
	expect(responseSignup.status).toBe(422);
	expect(responseSignup.data.message).toBe("Invalid car plate.");
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
	const responseSignup = await axios.post("http://localhost:3000/signup", input);
	expect(responseSignup.status).toBe(200);
	const outputSignup = responseSignup.data;
	expect(outputSignup.accountId).toBeDefined();
	const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
	const outputGetAccount = responseGetAccount.data;
	expect(outputGetAccount.name).toBe(input.name);
	expect(outputGetAccount.email).toBe(input.email);
	expect(outputGetAccount.cpf).toBe(input.cpf);
	expect(outputGetAccount.isPassenger).toBe(false);
	expect(outputGetAccount.isDriver).toBe(false);
	expect(outputGetAccount.car_plate).toBe(input.carPlate);
});