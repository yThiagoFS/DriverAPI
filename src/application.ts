import crypto from "crypto";
import { validate } from "./validateCpf";
import { getAccountByEmail, getAccountById, saveAccount } from "./resource";

export async function signup(input: any): Promise<any> {
    const account = input;
    account.accountId = crypto.randomUUID();
    const accountExists = await getAccountByEmail(input.email);
    if(accountExists) throw new Error("Account already exists.");
    validateData(input);
    await saveAccount(account);
    return { accountId: account.accountId };
}

    
function validateData(input: any) {
    if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid Name.");
    if (!input.email.match(/^(.+)@(.+)$/)) throw new Error("Invalid Email.");
    if (!validate(input.cpf)) throw new Error("Invalid CPF.");
    if (input.isDriver && input.carPlate && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error("Invalid car plate.");
}

export async function getAccount(accountId: string): Promise<any> {
    const account = await getAccountById(accountId);
    if(!account) throw new Error("Account not found.");
    return account;
}

    