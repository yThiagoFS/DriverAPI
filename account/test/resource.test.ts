import Account from "../src/domain/entity/Account";
import { PgPromisseAdapter } from "../src/infra/database/DatabaseConnection";
import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepository";

test("Deve salvar um registro na tabela account e consultar por id", async function() {
    const connection = new PgPromisseAdapter()
    const account = Account.create("John Doe", `john.doe${Math.random()}@gmail.com`, "87748248800", "", true, false)
    const accountDAO = new AccountRepositoryDatabase(connection);
    await accountDAO.saveAccount(account);
    const accountById = await accountDAO.getAccountById(account.accountId);
    expect(accountById.accountId).toBe(account.accountId);
    expect(accountById.getName()).toBe(account.getName());
	expect(accountById.getEmail()).toBe(account.getEmail());
	expect(accountById.getCPF()).toBe(account.getCPF());
})

test("Deve salvar um registro na tabela account e consultar por email", async function() {
    const connection = new PgPromisseAdapter()
    const account = Account.create("John Doe", `john.doe${Math.random()}@gmail.com`, "87748248800", "", true, false)
    const accountDAO = new AccountRepositoryDatabase(connection);
    await accountDAO.saveAccount(account);
    const accountByEmail = await accountDAO.getAccountByEmail(account.getEmail());
    expect(accountByEmail?.accountId).toBe(account.accountId);
    expect(accountByEmail?.getName()).toBe(account.getName());
    expect(accountByEmail?.getEmail()).toBe(account.getEmail());
    expect(accountByEmail?.getCPF()).toBe(account.getCPF());
})