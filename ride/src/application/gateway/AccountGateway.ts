import { OutputSignup } from "../dtos/account/OutputSignup.type";
import { OutputGetById } from "../dtos/account/OutputGetById.type";

export interface AccountGateway {
    signup(input: any): Promise<OutputSignup>;
    getAccountById(accountId: string): Promise<OutputGetById>;
}

