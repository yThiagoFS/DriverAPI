import { AccountRepository } from "../../infra/repository/AccountRepository";

export class GetAccount {

    constructor(readonly accountDAO: AccountRepository) {
    }

    async execute(input: any): Promise<any> {
        const account = await this.accountDAO.getAccountById(input.accountId);
        if(!account) throw new Error("Account not found.");
        return account;
    }
}



    