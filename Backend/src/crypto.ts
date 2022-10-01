import bcrypt from "bcrypt";
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