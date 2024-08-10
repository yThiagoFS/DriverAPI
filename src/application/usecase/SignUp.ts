import { AccountRepository } from "../../infra/repository/AccountRepository";
import { MailerGateway } from "../../infra/gateway/MailerGateway";
import Account from "../../domain/Account";

export class Signup {

    constructor(readonly accountDAO: AccountRepository, readonly mailerGateway: MailerGateway) {
    }

    async execute (input: any): Promise<any> {
        const accountExists = await this.accountDAO.getAccountByEmail(input.email);
        if(accountExists) throw new Error("Account already exists.");
        const account = Account.create(input.name, input.email, input.cpf, input.carPlate, input.isPassenger, input.isDriver);
        await this.accountDAO.saveAccount(account);
        await this.mailerGateway.send(account.getEmail(), "Account created.", "Your account has been created.");
        return { accountId: account.accountId };
    }
}



    