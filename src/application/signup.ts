import crypto from "crypto";
import { AccountDAO } from "../resources/AccountDAO";
import { validate } from "./validateCpf";
import { MailerGateway } from "../resources/MailerGateway";
export class Signup {

    constructor(readonly accountDAO: AccountDAO, readonly mailerGateway: MailerGateway) {
    }

    async execute (input: any): Promise<any> {
        const account = input;
        account.accountId = crypto.randomUUID();
        const accountExists = await this.accountDAO.getAccountByEmail(input.email);
        if(accountExists) throw new Error("Account already exists.");
        this.validateData(input);
        await this.accountDAO.saveAccount(account);
        await this.mailerGateway.send(account.email, "Account created.", "Your account has been created.");
        return { accountId: account.accountId };
    }

    private validateData(input: any) {
        if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid Name.");
        if (!input.email.match(/^(.+)@(.+)$/)) throw new Error("Invalid Email.");
        if (!validate(input.cpf)) throw new Error("Invalid CPF.");
        if (input.isDriver && input.carPlate && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error("Invalid car plate.");
    }
}



    