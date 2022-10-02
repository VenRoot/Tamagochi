import { iToken } from "./interface/token";
import crypto from "crypto";
import s from "node-schedule";
import fs from "fs";
import { getFile, saveFile } from "./files";

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
    /**
     * @description Saves the tokens. Encrypted with AES-256-CBC
     * @returns {iToken | undefined}
     */
    public static saveTokens = () => saveFile("sessions", "tokens.json", Token.tokens);

    /**
     * @description Loads the tokens. Decrypted with AES-256-CBC
     */
    public static loadTokens = () => {
        let file = getFile<iToken[]>("sessions", "tokens.json");
        if(!file) return console.warn("Could not load tokens");
        file.forEach(t => {
            // We need to recreate the object to get the correct prototype with all the methods
            t.created = new Date(t.created);
            Token.tokens.push(t);
        })
        Token.tokens = file;
    }

    public static get = (token: string) => this.tokens.find(t => t.token === token);
    public static getAll = () => Token.tokens;
}

//Schedule a job to remove all expired tokens every 5 minutes
s.scheduleJob("*/5 * * * *", () => checkValidTokens());

const checkValidTokens = () => {
    Token.tokens = Token.tokens.filter(t => {
        if(t.user?.keepLoggedIn) return true;
        return Date.now() - t.created.getTime() < 600000;
    });
    Token.saveTokens();
}

setTimeout(() => checkValidTokens(), 10000);

//Load tokens on startup
Token.loadTokens();