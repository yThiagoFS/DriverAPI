import express from "express";
import { GetAccount } from "../application/getAccount";
import { Signup } from "../application/signup";
import { AccountDAODatabase } from "../resources/AccountDAO";
import { MailerGatewayMemory } from "../resources/MailerGateway";
const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
    try{
        const accountDAO = new AccountDAODatabase();
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
    const accountDAO = new AccountDAODatabase();
    const getAccount = new GetAccount(accountDAO);
    const input = {
        accountId: req.params.accountId
    }
    const account = await getAccount.execute(input);
    res.json(account);
});

app.listen(3000);