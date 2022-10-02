import constants from "../constants.js";

export const getToken = async () => {
    if(sessionStorage.getItem("token") !== null) {
        return sessionStorage.getItem("token") as string;
    }

    const request = await fetch(constants.URLs.token, {
        method: "GET"
    });
    if(request.ok) {
        const token = await request.text();
        sessionStorage.setItem("token", token);
        return token;
    }
    else throw new Error("Error while fetching token");
}