import express from "express";
import { getAccount, signup } from "./application";
const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
    try{
        const output = await signup(req.body);
        res.json(output);
    }catch(error: any){
        res.status(422).json({ 
            message: error.message
        });
    }
    
});

app.get("http://localhost:3000/accounts/:accountId", async function (req, res) {
    const account = await getAccount(req.params.accountId);
    res.json(account);
});

app.listen(3000);