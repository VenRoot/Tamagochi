import { iToken } from "./interface/token";
import crypto from "crypto";


export class Token {
    static tokens: iToken[] = [];

    public static generate = (): string => 
    {
        let token = crypto.randomBytes(64).toString("base64url");
        while(Token.tokens.find(t => t.token == token)) token = crypto.randomBytes(64).toString("base64url");
        return token;
    }

    public static add = (token: iToken) => Token.tokens.push(token);
    public static remove = (token: string) =>  {
        const index = Token.tokens.findIndex(t => t.token === token);
        if(index === -1) return false;
        Token.tokens.splice(index, 1);
        return true;
    }

    public static append = (token: string, user: iToken["user"]) => {
        const index = Token.tokens.findIndex(t => t.token === token);
        if(index === -1) return false;
        Token.tokens[index].user = user;
        return true;
    }

    public static get = (token: string) => this.tokens.find(t => t.token === token);
    public static getAll = () => Token.tokens;
}