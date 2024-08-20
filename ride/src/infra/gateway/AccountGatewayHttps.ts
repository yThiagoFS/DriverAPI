import { OutputGetById } from "../../application/dtos/account/OutputGetById.type";
import { OutputSignup } from "../../application/dtos/account/OutputSignup.type";
import { AccountGateway } from "../../application/gateway/AccountGateway";
import { HttpClient } from "../http/HttpClient";

export class AccountGatewayHttps implements AccountGateway {
    
    constructor(readonly httpClient: HttpClient){

    }

    async signup(input: any): Promise<OutputSignup> {
        const response = await this.httpClient.post("https://localhost:3002/accounts/signup", input);
        return response;
    }
    
    async getAccountById(accountId: string): Promise<OutputGetById> {
        const response = await this.httpClient.get(`https://localhost:3002/accounts/${accountId}`);
        return response;
    }
}