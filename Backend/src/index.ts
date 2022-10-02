import express from "express";
import dotenv from "dotenv";
import path from "path";
import bodyParser from "body-parser";
import crypto from "crypto";
import { Token } from "./token";
import C from "./constants";
import { createUser, getUserData, getUserNameAndMail, query } from "./sql";
import fs from "fs";
import { RowDataPacket } from "mysql2/promise";
import { authUser, hashPassword } from "./crypto";
import { iUser } from "./interface/sql";
dotenv.config({path: path.join(__dirname, "..", ".env")});
export const app = express();

console.log(process.env);

import "v8-compile-cache";
import { Tamagochi } from "./game";
import { iTamagochiRequest } from "./interface/game";

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

    const user = (await getUserNameAndMail(username))[0];
    if(!user) return res.status(404).send("User not found");

    //Checks if the user is already logged in with the same token
    if(Token.get(token)?.user) return res.status(400).send("Bad login: User already logged in");

    let allTokens = Token.getAll();
    if(allTokens.find(t => t.user?.username === user.username || t.user?.username === user.email)) return res.status(400).send("Bad login: User already logged in");

    if(await authUser(user.username, password, res) != true) return;

    let appened = Token.append(token, {
        username: user.username,
        //Check if keepLoggedIn is a boolean, if not, try to parse it
        keepLoggedIn: typeof keepLoggedIn === "boolean" ? keepLoggedIn : keepLoggedIn === "true"
    });
    if(!appened) return res.status(400).send("Bad login: Token not found");
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

/**
 * @description Returns a tamagotchi for the user
 */
app.get(C.urls.tamagochi, async (req, res) => {
    const token = req.headers["token"] as string;
    const username = req.headers["username"] as string;
    if(!token) return res.status(401).send("Unauthorized");

    const user = Token.get(token)?.user;
    if(!user) return res.status(401).send("Not logged in");
    if(user.username != username) return res.status(403).send("Permission denied");

    const tamagochi = Tamagochi.instances.find(t => t.owner === user.username);
    if(!tamagochi) return res.status(404).send("Tamagochi not found");

    res.status(200).json(tamagochi);
});

/**
 * @description Creates a tamagotchi for the user
 */

app.put(C.urls.tamagochi, async (req, res) => {
    const token = req.headers["token"] as string;
    const username = req.headers["username"] as string;
    const tamaName = req.headers["tamaname"] as string;
    if(!token) return res.status(401).send("Unauthorized");
    if(!tamaName) return res.status(400).send("Bad Request");

    const user = Token.get(token)?.user;
    if(!user) return res.status(401).send("Not logged in");
    if(user.username != username) return res.status(403).send("Permission denied");

    const tamagochi = Tamagochi.instances.find(t => t.owner === user.username);
    if(tamagochi) return res.status(400).send("You currently can only have one Tamagochi at a time");

    try
    {
        const newTamagochi = Tamagochi.newTama(tamaName, username);
        //Send the new tamagotchi to the user
        res.status(200).json(newTamagochi).end();
    }
    catch(err)
    {
        console.log(err);
        if(!res.writableEnded) return res.status(500).end("Internal Server Error");
    }
});

/**
 * @description Handles the request to modify the tamagotchi
 */
app.post(C.urls.tamagochi, async (req, res) => {
    const token = req.headers["token"] as string;
    const username = req.headers["username"] as string;
    if(!token) return res.status(401).send("Unauthorized");

    const user = Token.get(token)?.user;
    if(!user) return res.status(401).send("Not logged in");
    if(user.username != username) return res.status(403).send("Permission denied");
    
    const tamagochi = Tamagochi.instances.find(t => t.owner === user.username);
    if(!tamagochi) return res.status(404).send("Tamagochi not found");

    const body = req.body as iTamagochiRequest;
    if(!body) return res.status(400).send("Bad Request");

    try
    {
        tamagochi.handle(body);
        res.status(200).json(tamagochi).end();
    }
    catch(err)
    {
        console.log(err);
        if(!res.writableEnded) return res.status(500).end("Internal Server Error");
    }
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