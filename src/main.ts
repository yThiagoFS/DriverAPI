import express from "express";
import { AccountRepositoryDatabase } from "./infra/repository/AccountRepository";
import { MailerGatewayMemory } from "./infra/gateway/MailerGateway";
import { Signup } from "./application/usecase/SignUp";
import { GetAccount } from "./application/usecase/GetAccount";
import { PgPromisseAdapter } from "./infra/database/DatabaseConnection";
const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
    var pgPromiseAdapter = new PgPromisseAdapter();
    const accountDAO = new AccountRepositoryDatabase(pgPromiseAdapter);
    const mailerGateway = new MailerGatewayMemory();
    const signup = new Signup(accountDAO, mailerGateway);
    const output = await signup.execute(req.body);
    res.json(output);
});

app.get("http://localhost:3000/accounts/:accountId", async function (req, res) {
    var pgPromiseAdapter = new PgPromisseAdapter();
    const accountDAO = new AccountRepositoryDatabase(pgPromiseAdapter);
    const getAccount = new GetAccount(accountDAO);
    const input = {
        accountId: req.params.accountId
    }
    const account = await getAccount.execute(input);
    res.json(account);
});

app.listen(3000);