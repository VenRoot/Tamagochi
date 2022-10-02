import bcrypt from "bcrypt";
import crypto from "crypto";
import {getUserData} from "./sql";
import { RowDataPacket } from "mysql2";
import { iUser } from "./interface/sql";
import { Request, Response } from "express";
export const hashPassword = (password: string) => bcrypt.hashSync(password, 10);
export const comparePassword = (password: string, hash: string) => bcrypt.compareSync(password, hash);

export const authUser = async (username: string, password: string, res: Response) =>
{
    const user = await getUserData(username) as iUser[];

    if(user.length == 0) return res.status(401).send("Wrong username or password");
    if(!comparePassword(password, user[0].password)) return res.status(402).send("Wrong username or password");
    return true;
}

/**
 * 
 * @param text 
 * @param key Needs to be 32 bytes/characters long
 * @returns 
 */
export const encrypt = (text: string) => {
    const key = process.env.sessionEncryptionKey;
    if(key.length != 32) throw new Error("Key needs to be 32 bytes/characters long");
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
};

export const decrypt = (text: string) => {
    console.log(process.env.sessionEncryptionKey)
    const key = process.env.sessionEncryptionKey;
    const textParts = text.split(":");
    const iv = Buffer.from(textParts.shift() as string, "hex");
    const encryptedText = Buffer.from(textParts.join(":"), "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}