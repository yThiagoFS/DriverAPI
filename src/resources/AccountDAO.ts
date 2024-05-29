import pgp from "pg-promise";

export interface AccountDAO {
    getAccountByEmail(email: string): Promise<any>;
    getAccountById(id: string): Promise<any>;
    saveAccount(account: any): Promise<void>;
}

export class AccountDAODatabase implements AccountDAO {

    async getAccountByEmail(email: string): Promise<any>  {
        const connection = pgp()("postgress://postgress:123456@localhost:5432/app");
        const accountExists = await connection.any("select * from db.account where email = $1", [email]);
        await connection.$pool.end();
        return accountExists;
    }

    async getAccountById(id: string): Promise<any> {
        const connection = pgp()("postgress://postgress:123456@localhost:5432/app");
        const accountExists = await connection.any("select * from db.account where id = $1", [id]);
        await connection.$pool.end();
        return accountExists;
    }

    async saveAccount(account: any): Promise<void> {
        const connection = pgp()("postgress://postgress:123456@localhost:5432/app");
        await connection.query("insert into db.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [account.id, account.name, account.email, account.cpf, account.carPlate, !!account.isPassenger, !!account.isDriver]);
        await connection.$pool.end();
    }
}

export class AccountDAOInMemoryDatabase implements AccountDAO {
    accounts: any[];

    constructor() {
        this.accounts = [];
    }
    
    async getAccountByEmail(email: string): Promise<any> {
        this.accounts.find((ac: any) => ac.email === email);
    }

    async getAccountById(id: string): Promise<any> {
        this.accounts.find((ac: any) => ac.accountId === id);
    }

    async saveAccount(account: any): Promise<void> {
        this.accounts.push(account);
    }

}