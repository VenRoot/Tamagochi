import constants from "../constants.js";
import { getToken, getUsername } from "../backend/index.js";


const canvas = document.getElementById('canvas') as HTMLCanvasElement;

class Tamagochi
{
    public name!: string;
    public created!: Date;
    public saturation!: number;
    public happiness!: number;
    public health!: number;
    public alive!: boolean;
    public inventory!:
    {
        food: number;
        water: number;
        money: number;
    }

    constructor()
    {
        Tamagochi.getTamagochi().then(tama => {
            this.name = tama.name;
            this.created = new Date(tama.created);
            this.saturation = tama.saturation;
            this.happiness = tama.happiness;
            this.health = tama.health;
            this.alive = tama.alive;
            this.inventory = tama.inventory;
        }).catch(err => {
            throw new Error(err);
        })
    }

    update()
    {
        fetch(`${constants.URLs.BACKEND_URL}${constants.URLs.tamagochi}`, {
            method: 'POST',
        });
    }

    public static async getTamagochi()
    {
        const token = await getToken();
        const username = getUsername();
        if(username === null) throw new Error("Username is null");
        const request = await fetch(`${constants.URLs.BACKEND_URL}${constants.URLs.tamagochi}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "username": username,
                "token": token
            }
        });
        if(!request.ok)
        {
            throw new Error("Error while fetching tamagochi");
        }

        return await request.json() as iTama;
    }
}

interface iTama {
    name: string;
    owner: string;
    gender: string;
    created: Date;
    saturation: number;
    happiness: number;
    health: number;
    alive: boolean;
    inventory:
    {
        food: number;
        water: number;
        money: number;
    }
}

let x = await fetch("http://localhost/api/tamagochi",
{
headers: {
"username": "VenRoot",
"token": "fnrac5GSnB8juCh4jCO3N4261NWcYob2BQBMkdOlnc3V1j_90U4um2gc00mjAtn8ketV3CmWK_D3orRX2E_FaA"
}
});