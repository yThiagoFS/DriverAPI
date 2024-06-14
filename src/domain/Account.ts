import crypto from "crypto";
import { validate } from "./validateCpf";

export default class Account {

    private constructor(readonly accountId: string,
        readonly name: string,
        readonly email: string,
        readonly cpf: string,
        readonly carPlate: string,
        readonly isPassenger: boolean,
        readonly isDriver: boolean) {
        if (!this.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid Name.");
        if (!this.email.match(/^(.+)@(.+)$/)) throw new Error("Invalid Email.");
        if (!validate(this.cpf)) throw new Error("Invalid CPF.");
        if (this.isDriver && this.carPlate && !this.carPlate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error("Invalid car plate.");
    }

    static create(name: string,
        email: string,
        cpf: string,
        carPlate: string,
        isPassenger: boolean,
        isDriver: boolean) {
        const accoutId = crypto.randomUUID();
        return new Account(accoutId, name, email, cpf, carPlate, isPassenger, isDriver);
    }

    static restore(
        accountId: string,
        name: string,
        email: string,
        cpf: string,
        carPlate: string,
        isPassenger: boolean,
        isDriver: boolean) {
            return new Account(accountId, name, email, cpf, carPlate, isPassenger, isDriver);
    }
}