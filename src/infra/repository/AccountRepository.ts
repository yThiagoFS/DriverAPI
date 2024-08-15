import Account from "../../domain/entity/Account";
import DatabaseConnection from "../database/DatabaseConnection";

export interface AccountRepository {
    getAccountByEmail(email: string): Promise<Account | undefined>;
    getAccountById(id: string): Promise<Account>;
    saveAccount(account: Account): Promise<void>;
}

export class AccountRepositoryDatabase implements AccountRepository {

    constructor(readonly databaseConnection: DatabaseConnection) {

    }
    
    async getAccountByEmail(email: string): Promise<any>  {
        const [accountData] = await this.databaseConnection.query("select * from db.account where email = $1", [email]);
        await this.databaseConnection.close();
        if(!accountData) return;
        return Account.restore(accountData.account_id, accountData.name, accountData.email, accountData.cpf, accountData.car_plate, accountData.is_passenger, accountData.is_driver);
    }

    async getAccountById(id: string): Promise<Account> {
        const [accountData] = await this.databaseConnection.query("select * from db.account where id = $1", [id]);
        await this.databaseConnection.close();
        return Account.restore(accountData.account_id, accountData.name, accountData.email, accountData.cpf, accountData.car_plate, accountData.is_passenger, accountData.is_driver);
    }

    async saveAccount(account: Account): Promise<void> {
        await this.databaseConnection.query("insert into db.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [account.accountId, account.getName(), account.getEmail(), account.getCPF(), account.getCarPlate(), !!account.isPassenger, !!account.isDriver]);
        await this.databaseConnection.close();
    }
}

export class AccountRepositoryInMemoryDatabase implements AccountRepository {
    accounts: any[];

    constructor() {
        this.accounts = [];
    }
    
    async getAccountByEmail(email: string): Promise<any> {
        this.accounts.find((ac: Account) => ac.getEmail() === email);
    }

    async getAccountById(id: string): Promise<any> {
        this.accounts.find((ac: Account) => ac.accountId === id);
    }

    async saveAccount(account: any): Promise<void> {
        this.accounts.push(account);
    }

}