import express from "express";
import { AccountRepositoryDatabase } from "./infra/repository/AccountRepository";
import { MailerGatewayMemory } from "./infra/gateway/MailerGateway";
import { Signup } from "./application/usecase/SignUp";
import { GetAccount } from "./application/usecase/GetAccount";
const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
    try{
        const accountDAO = new AccountRepositoryDatabase();
        const mailerGateway = new MailerGatewayMemory();
        const signup = new Signup(accountDAO, mailerGateway);
        const output = await signup.execute(req.body);
        res.json(output);
    }catch(error: any){
        res.status(422).json({ 
            message: error.message
        });
    }
    
});

app.get("http://localhost:3000/accounts/:accountId", async function (req, res) {
    const accountDAO = new AccountRepositoryDatabase();
    const getAccount = new GetAccount(accountDAO);
    const input = {
        accountId: req.params.accountId
    }
    const account = await getAccount.execute(input);
    res.json(account);
});

app.listen(3000);