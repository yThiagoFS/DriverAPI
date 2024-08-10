import pgp from "pg-promise";

export default interface DatabaseConnection {
    query(statement: string, params: any): Promise<any>;
    update(statement: string, params: any): Promise<any>;
    close(): Promise<void>;
}

export class PgPromisseAdapter implements DatabaseConnection {
    connection: any; 

    constructor(){
        this.connection = pgp()("postgress://postgress:123456@localhost:5432/app");
    }

    async query(statement: string, params: any): Promise<any> {
        return this.connection.query(statement, params);
    }

    async update(statement: string, params: any) {
        return this.connection.update(statement, params);
    }

    async close(): Promise<void> {
        return await this.connection.$pool.end();
    }
    
}