import { getAllTamaFiles, getFile, saveFile } from "./files";

export class Tamagochi {
    public static instances: Tamagochi[] = [];
    public readonly name: string;
    public readonly gender: string;
    public readonly created: Date;
    public readonly saturation: number;
    public readonly happiness: number;
    public readonly health: number;
    public readonly alive: boolean;
    public readonly owner: string;
    public readonly inventory: {
        food: number;
        water: number;
        money: number;
    }


    getTama = () => this;
    /**
     * @description Creates a new Tamagochi
     * @param name 
     * @param owner 
     */
    static newTama(name: string, owner: string) {

        let tama = new Tamagochi(name, undefined, undefined, undefined, undefined, undefined, undefined, owner);
        tama.save();
        Tamagochi.instances.push(tama);
        return tama;
    }


    /**
     * @description This function is used to recreate the saved tamagochi from the file passed by `load()`
     * @param name 
     * @param gender 
     * @param created 
     * @param hunger 
     * @param happiness 
     * @param health 
     * @param alive 
     * @param owner 
     */
    constructor(name: string, gender: "male" | "female" = Math.random() < 0.5 ? "male" : "female", created = new Date(), hunger = 10, happiness: number = 0, health = 100, alive = true, owner: string) {
        this.name = name;
        this.gender = gender;
        this.created = created;
        this.saturation = hunger;
        this.happiness = happiness;
        this.health = health;
        this.alive = alive;
        this.owner = owner;
        this.inventory = {
            food: 0,
            water: 0,
            money: 0
        }
    }
    /**
     * @description Used to save the tamagochi into the json file of the owner
     */
    save() {
        saveFile<Tamagochi>("tama", this.owner, this);
    }

    /**
     * @description This function is used to get all the tamagochi from the file, should only be called when the server starts
     */
    static load() {
        let tamas = getAllTamaFiles();
        tamas.forEach(tama => Tamagochi.instances.push(new Tamagochi(tama.name, tama.gender as "male" | "female", tama.created, tama.saturation, tama.happiness, tama.health, tama.alive, tama.owner)))
    }

    addFood = (amount: number) => this.inventory.food += amount;
    addWater = (amount: number) => this.inventory.water += amount;
    addMoney = (amount: number) => this.inventory.money += amount;

    calcHealth = () =>
    {
        let health = 100;
        if(this.saturation < 10)
        {
            health -= (this.saturation - 10) * 10;
        }
        if(this.happiness < 0)
        {
            health -= this.happiness * 10;
        }
        return health;
    }
}