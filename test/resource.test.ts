import Account from "../src/domain/Account";
import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepository";

test("Deve salvar um registro na tabela account e consultar por id", async function() {
    const account = Account.create("John Doe", `john.doe${Math.random()}@gmail.com`, "87748248800", "", true, false)
    const accountDAO = new AccountRepositoryDatabase();
    await accountDAO.saveAccount(account);
    const accountById = await accountDAO.getAccountById(account.accountId);
    expect(accountById.account_id).toBe(account.accountId);
    expect(accountById.name).toBe(account.name);
	expect(accountById.email).toBe(account.email);
	expect(accountById.cpf).toBe(account.cpf);
})

test("Deve salvar um registro na tabela account e consultar por email", async function() {
    const account = Account.create("John Doe", `john.doe${Math.random()}@gmail.com`, "87748248800", "", true, false)
    const accountDAO = new AccountRepositoryDatabase();
    await accountDAO.saveAccount(account);
    const accountByEmail = await accountDAO.getAccountByEmail(account.email);
    expect(accountByEmail?.account_id).toBe(account.accountId);
    expect(accountByEmail?.name).toBe(account.name);
    expect(accountByEmail?.email).toBe(account.email);
    expect(accountByEmail?.cpf).toBe(account.cpf);
})