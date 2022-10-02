import express from "express";
import dotenv from "dotenv";
import path from "path";
import bodyParser from "body-parser";
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

import "v8-compile-cache";

app.use(bodyParser.json());

app.use(async (req, res, next) => {
    const token = req.headers["token"];
    const location = req.path;
    // console.log(location);
    if (location === C.urls.token || location === C.urls.getSicherheitsfragen) {} 
    else if(!token) return res.status(401).send("Unauthorized");

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get(C.urls.token, (req, res) => {
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
app.post(C.urls.login, async (req, res) => {
    const {username, password, keepLoggedIn} = req.body;
    const token = req.headers["token"] as string;
    if(!username || !password || !token) return res.status(400).send("Bad Request");
    if(Token.get(token)?.user) return res.status(400).send("Bad login: User already logged in");

    if(await authUser(username, password, res) != true) return;

    Token.append(token, {
        username,
        keepLoggedIn
    });
    res.status(200).end("OK");
});

/**
 * @description Registriert einen User
 */
app.put(C.urls.login, async (req, res) => {
    //Get the body of the request
    const body = req.body as iUser;
    const token = req.headers["token"] as string;

    if(!body.username || !body.password || !body.email || !body.Sicherheitsfrage || !body.Sicherheitsantwort || !token) return res.status(400).send("Bad Request");
    if(Token.get(token)?.user) return res.status(400).send("Bad login. Please logout first");
    console.log({username: body.username, email: body.email, password: hashPassword(body.password), Sicherheitsfrage: body.Sicherheitsfrage, Sicherheitsantwort: body.Sicherheitsantwort});
    let x = await createUser({username: body.username, email: body.email, password: hashPassword(body.password), Sicherheitsfrage: body.Sicherheitsfrage, Sicherheitsantwort: body.Sicherheitsantwort}).catch(err => {
        console.log("WELP")
        if(err.message.includes("Duplicate entry") && err.message.includes("users_UN")) res.status(400).end("Username already exists");
        else if (err.message.includes("Duplicate entry") && err.message.includes("users_mail_UN")) res.status(400).end("Email already exists");
        else res.status(500).end("Internal Server Error");
        return;
    });
    //Check if the result has been sent already
    if(res.writableEnded) return;
    if(x) res.status(200).end("OK");
    else res.status(500).end("Internal Server Error");
});



app.get(C.urls.getSicherheitsfragen, (req, res) => {
    if(!fs.existsSync(C.paths.Sicherheitsfragen)) return res.status(500).send("Internal Server Error");
    const data = fs.readFileSync(C.paths.Sicherheitsfragen, "utf8");
    res.setHeader("Content-Type", "application/json");
    res.status(200).end(data);
});

app.listen(Number(process.env.PORT), "0.0.0.0", () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
