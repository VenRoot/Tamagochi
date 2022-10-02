import constants from "../constants.js";
import Toastify from "../modules/toastify/toastify-es.js";
import { getToken } from "./index.js";

export const login = async (username: string, password: string, keepLoggedIn: boolean) => {
    const token = await getToken();
    const x = await fetch(`${constants.URLs.BACKEND_URL}${constants.URLs.login}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "token": token
        },
        body: JSON.stringify({
            username,
            password,
            keepLoggedIn
        })
    });

    if(x.ok)
    {
        Toastify({
            text: "Login erfolgreich",
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            duration: 3000,
            style:
            {
                //Green backround linear gradient
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();
    }
    else
    {
        let error = await x.text();
        Toastify({
            text: error,
            close: true,
            className: "error",
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                //Make a red background with some linear gradient
                background: "linear-gradient(to right, #ff5f6d, #ffc371)"
            },
            duration: 3000
        }).showToast();
    }
}