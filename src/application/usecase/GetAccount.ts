import { AccountRepository } from "../../infra/repository/AccountRepository";

export class GetAccount {

    constructor(readonly accountRepository: AccountRepository) {
    }

    async execute(input: any): Promise<Output> {
        const account = await this.accountRepository.getAccountById(input.accountId);
        if(!account) throw new Error("Account not found.");
        return {
            accountId: account.accountId,
            name: account.getName(),
            email: account.getEmail(),
            cpf: account.getCPF(),
            carPlate: account.getCarPlate(),
            isPassenger: account.isPassenger,
            isDriver: account.isDriver
        };
    }
}

type Output = {
    accountId: string,
    name: string,
    email: string,
    cpf: string,
    carPlate: string,
    isPassenger: boolean,
    isDriver: boolean
}

    