import express from "express";
import dotenv from "dotenv";
import path from "path";
import crypto from "crypto";
import { Token } from "./token";
import C from "./constants";
import { createUser, getUserData, query } from "./sql";
import fs from "fs";
import { RowDataPacket } from "mysql2/promise";
import { authUser, hashPassword } from "./crypto";
import { iUser } from "./interface/sql";
dotenv.config({path: path.join(__dirname, "..", ".env")});
export const app = express();


app.use(async (req, res, next) => {
    const username = req.headers["username"];
    const password = req.headers["password"];
    const token = req.headers["token"];
    const location = req.path;
    // console.log(location);
    if((!username && !password && !token && location != C.paths.token)) return res.status(401).send("Unauthorized");
    if(!token && location != C.paths.token) return res.status(401).send("Unauthorized");

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get(C.paths.token, (req, res) => {
    const token = Token.generate();
    Token.add({
        token,
        created: new Date()
    });
    res.status(200).end(token);
});

/**
 * @description Authentifiziert einen User
 */
app.post(C.paths.login, async (req, res) => {
    const username = req.headers["username"] as string;
    const password = req.headers["password"] as string;
    const keepLoggedIn = req.headers["keepLoggedIn"] as string == "true";
    const token = req.headers["token"] as string;
    if(!username || !password || !token) return res.status(400).send("Bad Request");
    if(Token.get(token)?.user) return res.status(400).send("Bad Request");

    if(await authUser(username, password, res) != true) return;

    Token.append(token, {
        username,
        keepLoggedIn
    });
    res.status(200).end("OK");
});

app.put(C.paths.login, (req, res) => {
    const username = req.headers["username"] as string;
    const password = req.headers["password"] as string;
    const email = req.headers["email"] as string;
    const token = req.headers["token"] as string;

    if(!username || !password || !email || !token) return res.status(400).send("Bad Request");
    if(Token.get(token)?.user) return res.status(400).send("Bad login. Please logout first");

    createUser(username, email, hashPassword(password));
    res.status(200).end("OK");
});

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});

(async() => {
    console.log("hi")
})();