import pgp from "pg-promise";

export async function getAccountByEmail(email: string): Promise<any>  {
    const connection = pgp()("postgress://postgress:123456@localhost:5432/app");
    const accountExists = await connection.any("select * from db.account where email = $1", [email]);
    await connection.$pool.end();
    return accountExists;
}

export async function getAccountById(id: string): Promise<any> {
    const connection = pgp()("postgress://postgress:123456@localhost:5432/app");
    const accountExists = await connection.any("select * from db.account where id = $1", [id]);
    await connection.$pool.end();
    return accountExists;
}

export async function saveAccount(account: any) {
    const connection = pgp()("postgress://postgress:123456@localhost:5432/app");
    await connection.query("insert into db.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [account.id, account.name, account.email, account.cpf, account.carPlate, !!account.isPassenger, !!account.isDriver]);
    await connection.$pool.end();
}