import { getAllTamaFiles, getFile, saveFile } from "./files";
import { iTamagochiRequest } from "./interface/game";
import s from "node-schedule";

export class Tamagochi {
    public static instances: Tamagochi[] = [];
    public readonly name: string;
    public readonly owner: string;
    public readonly gender: string;
    public readonly created: Date;
    public saturation: number;
    public happiness: number;
    public health: number;
    public alive: boolean;
    public energy: number;
    public asleep: Date | null;
    public dirty: number;
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

        let tama = new Tamagochi(name, owner);
        tama.save();
        Tamagochi.instances.push(tama);
        return tama;
    }


    /**
     * @description This function is used to recreate the saved tamagochi from the file passed by `load()`
     * @param name 
     * @param owner 
     * @param gender 
     * @param created 
     * @param hunger 
     * @param happiness 
     * @param health 
     * @param alive 
     */
    constructor(name: string, owner: string, gender: "male" | "female" = Math.random() < 0.5 ? "male" : "female", created = new Date(), hunger = 10, happiness = 0, health = 100, alive = true, energy = 100, asleep = null, dirty = 0) {
        this.name = name;
        this.owner = owner;
        this.gender = gender;
        this.created = created;
        this.saturation = hunger;
        this.happiness = happiness;
        this.health = health;
        this.alive = alive;
        this.energy = energy;
        this.asleep = asleep;
        this.dirty = dirty;
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
        console.log(JSON.stringify(tamas));
        if (!tamas) throw new Error("No tamagochi found");
        tamas.forEach(tama => {
            try {
                if (!tama) throw new Error("Tamagochi not found");
                Tamagochi.instances.push(new Tamagochi(tama.name, tama.owner, tama.gender as "male" | "female", tama.created, tama.saturation, tama.happiness, tama.health, tama.alive))
            }
            catch (err) {
                console.error("Tama konnte nicht geladen werden", err);
            }
        });
    }

    addFood = (amount: number) => this.inventory.food += amount;
    addWater = (amount: number) => this.inventory.water += amount;
    addMoney = (amount: number) => this.inventory.money += amount;

    sleep = () => {
        this.asleep = new Date();
        this.save();
    }

    kill = () => {
        this.alive = false;
        this.save();
    }

    revive = () => {
        this.alive = true;
        this.save();
    }

    wakeUp = () => {
        this.asleep = null;
        this.save();
    }

    handle = (props: iTamagochiRequest) => {
        switch(props.action)
        {
            case "feed":
                if(this.inventory.food > 0)
                {
                    this.inventory.food--;
                    this.saturation += 10;
                    this.save();
                    return true;
                } else return false;
            case "clean":
                if(this.inventory.water > 0)
                {
                    this.inventory.water--;
                    this.dirty = 0;
                    this.save();
                    return true;
                } else return false;
            case "play":
                this.happiness += 10;
                this.save();
                return true;
            case "sleep":
                this.sleep();
                return true;
            case "wakeUp":
                this.wakeUp();
                return true;
            case "kill":
                this.kill();
                return true;
            default:
                throw new Error("Action not found");
        }
    }

    /**
     * @description This function is used to update the tamagochi. For example, if the tamagochi is asleep, the energy will be increased
     * The update function is called every 30 seconds
     */
    update = () => {
        //Sleep / Energy
        if (true) {
            //Check if the tamagochi is asleep
            if (this.asleep) {
                if (this.energy < 100) {
                    //A full recovery takes 6 hours, the function is called every 30 seconds, the energy should be full after 720 calls
                    this.energy += 100 / 720;
                }
                else {
                    this.wakeUp();
                }
            }
            else {
                if (this.energy > 0) {
                    //From 100 to 0, it takes 18 hours, the function is called every 30 seconds, the energy should be 0 after 2160 calls
                    this.energy -= 100 / 2160;
                }
                else {
                    this.sleep();
                }
            }
        }

        //Hunger
        if (true) {

            //From 100 to 0, it takes 120 hours, the function is called every 30 seconds, the hunger should be 0 after 21600 calls
            this.saturation -= 100 / 21600;
            if(this.saturation < 0) this.kill();

            if (this.saturation > 0) {
                //From 100 to 0, it takes 72 hours, the function is called every 30 seconds, the saturation should be 0 after 8640 calls
                this.saturation -= 100 / 8640;
            }
            //Calculate the health based on the saturation. The more the hunger is, the less health the tama has. Calculate based on asymptote
            else if(this.saturation < 10)
            {
                this.health = Math.log(this.saturation)/Math.LN10+2;
            }
        }

        //Happiness
        if (true) {
            //From 100 to 0, it takes 6 hours, the function is called every 30 seconds, the happiness should be 0 after 720 calls
            this.happiness -= 100 / 720;
        }

        this.save();
    }
}

//Load all tamagochi when the server starts
Tamagochi.load();

//Schedule the update function for every tamagochi every 30 seconds
setInterval(() => {
    Tamagochi.instances.forEach(tama => tama.update());
}, 30000);