import pgp from "pg-promise";

export default interface DatabaseConnection {
    query(statement: string, params: any, transactional?: boolean): Promise<any>;
    update(statement: string, params: any): Promise<any>;
    close(): Promise<void>;
    commit(): Promise<void>;
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

    async commit() : Promise<void> {
        await this.connection.commit();
    }
    
}

export class UnitOfWork implements DatabaseConnection {
    connection: any; 
    statements: { statement: string, data: any }[];

    constructor(){
        this.connection = pgp()("postgress://postgress:123456@localhost:5432/app");
        this.statements = [];
    }

    async query(statement: string, params: any, transactional: boolean = false): Promise<any> {
        if(!transactional) return this.connection.query(statement, params);
        this.statements.push({ statement, data: params });
    }

    async update(statement: string, params: any) {
        return this.connection.update(statement, params);
    }

    async close(): Promise<void> {
        return await this.connection.$pool.end();
    }

    async commit() : Promise<void> {
        await this.connection.tx(async (t: any) => {
            const transactions = [];
            for(const statement of this.statements)
                transactions.push(t.query(statement.statement, statement.data));
            return t.batch(transactions);
        })
    }
}