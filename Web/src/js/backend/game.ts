import constants from "../constants";
import { getToken } from "./index";

export const getTamagochi = async () => {
    const token = await getToken();
    const request = await fetch(`${constants.URLs.BACKEND_URL}${constants.URLs.tamagochi}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": token
        }
    });
    if(request.ok) {
        const tamagochi = await request.json();
        return tamagochi;
    }
    else throw new Error("Error while fetching tamagochi");
}