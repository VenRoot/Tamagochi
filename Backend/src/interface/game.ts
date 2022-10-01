

export interface iTamagochi
{
    name: string;
    gender: "male" | "female";
    created: Date;
    hunger: number;
    happiness: number;
    health: number;
    alive: boolean;
    owner: string;
    inventory: {
        food: number;
        water: number;
        money: number;
    }
}