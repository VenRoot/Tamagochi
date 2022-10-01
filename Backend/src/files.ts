import fs from "fs";
import path from "path";
import { Tamagochi } from "./game";

export const getFile = <T>(type: "tama" | "setting", relativePath: string) =>
{
    let basePath = "";
    switch(type)
    {
        case "tama": basePath = path.join(__dirname, "..", "data", "pets"); break;
        case "setting": basePath = path.join(__dirname, "..", "data", "settings"); break;
    }
    if(!fs.existsSync(path.join(basePath, relativePath))) return null;
    const file = fs.readFileSync(path.join(basePath, relativePath), "utf-8");
    return JSON.parse(file) as T;
}

export const saveFile = <T>(type: "tama" | "setting", relativePath: string, data: T) =>
{
    let basePath = "";
    switch(type)
    {
        case "tama": basePath = path.join(__dirname, "..", "data", "pets"); break;
        case "setting": basePath = path.join(__dirname, "..", "data", "settings"); break;
    }
    if(!fs.existsSync(basePath)) fs.mkdirSync(basePath, { recursive: true });
    fs.writeFileSync(path.join(basePath, relativePath), JSON.stringify(data));
}


export const getAllTamaFiles =  () =>
{
    //Get all owners of a file as a string[]
    const owners = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "owners.json"), "utf-8")) as string[];
    const basePath = path.join(__dirname, "..", "data", "pets");
    const res:Tamagochi[] = [];
    for (const owner of owners) {
        if (!fs.existsSync(path.join(basePath, owner + ".json"))) continue;
        const tama = getFile<Tamagochi>("tama", owner + ".json");
        if (tama === null) continue;
        res.push(tama);
    }
    return res;
}