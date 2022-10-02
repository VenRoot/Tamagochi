import constants from "../constants.js";
import Toastify from "../modules/toastify/toastify-es.js";
import { getToken } from "./index.js";

export const getSecurityQuestions = async () => {
    const x = await fetch(`${constants.URLs.BACKEND_URL}${constants.URLs.getSicherheitsfragen}`, {
        method: "GET"
    });

    if(x.ok)
    {
        return await x.json() as string[];
    }
    else throw new Error("Error while fetching security questions");
};


export const appendSecurityQuestions = async (element: HTMLSelectElement) => {
    const questions = await getSecurityQuestions();
    questions.forEach(question => {
        const option = document.createElement("option");
        option.value = question;
        option.innerText = question;
        element.appendChild(option);
    });
};

export const checkValues = (usernameElement: HTMLInputElement, emailElement: HTMLInputElement, passwordElement: HTMLInputElement, passwordRepeatElement: HTMLInputElement, securityAnswerElement: HTMLInputElement, ButtonElement: HTMLButtonElement, hintElement: HTMLParagraphElement) => {
    const username = usernameElement.value;
    const email = emailElement.value;
    const password = passwordElement.value;
    const passwordRepeat = passwordRepeatElement.value;
    const securityAnswer = securityAnswerElement.value;

    const emailRegEx = new RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$");
    //Regex for password requirements (min 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character)
    const passwordRegEx = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_])[A-Za-z\\d\\W_]{8,}$");

    if(username === "" || email === "" || password === "" || passwordRepeat === "" || securityAnswer === "") 
    {
        ButtonElement.disabled = true;
        ButtonElement.classList.replace("bg-purple-600", "bg-purple-300");
        ButtonElement.classList.replace("hover:bg-purple-700", "hover:bg-purple-400")
        hintElement.innerText = "Bitte fülle alle Felder aus";
        return false;
    }
    else if(password !== passwordRepeat) 
    {
        passwordRepeatElement.style.borderColor = "red";
        ButtonElement.disabled = true;
        ButtonElement.classList.replace("bg-purple-600", "bg-purple-300");
        ButtonElement.classList.replace("hover:bg-purple-700", "hover:bg-purple-400")
        hintElement.innerText = "Die Passwörter stimmen nicht überein";
        return false;
    }
    else if(!passwordRegEx.test(password))
    {
        passwordElement.style.borderColor = "red";
        ButtonElement.disabled = true;
        ButtonElement.classList.replace("bg-purple-600", "bg-purple-300");
        ButtonElement.classList.replace("hover:bg-purple-700", "hover:bg-purple-400")
        hintElement.innerText = "Das Passwort muss mindestens 8 Zeichen lang sein und mindestens einen Großbuchstaben, einen Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten";
        return false;
    }
    else if(!emailRegEx.test(email)) 
    {
        ButtonElement.disabled = true;
        ButtonElement.classList.replace("bg-purple-600", "bg-purple-300");
        ButtonElement.classList.replace("hover:bg-purple-700", "hover:bg-purple-400")
        hintElement.innerText = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
        return false;
    }
    console.log("All values are valid");
    hintElement.innerText = "";
    ButtonElement.classList.replace("bg-purple-300", "bg-purple-600");
    ButtonElement.classList.replace("hover:bg-purple-400", "hover:bg-purple-700");
    passwordElement.style.borderColor = "green";
    passwordRepeatElement.style.borderColor = "green";
    ButtonElement.disabled = false;
    return true;
}

export const postRegister = (username: string, email: string, password: string, securityQuestion: string, securityAnswer: string) => 
{
    register(username, email, password, securityQuestion, securityAnswer);
    return false;
}

export const register = async (username: string, email: string, password: string, Sicherheitsfrage: string, Sicherheitsantwort: string) => {
    console.log("Registering user...");
    const token = await getToken();
    const x = await fetch(`${constants.URLs.BACKEND_URL}${constants.URLs.login}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "token": token
        },
        body: JSON.stringify({
            username,
            email,
            password,
            Sicherheitsfrage,
            Sicherheitsantwort
        })
    });
    if(x.ok)
    {
        Toastify({
            text: "Registrierung erfolgreich, Sie werden gleich zum Login weitergeleitet",
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
        setTimeout(() => {
            // document.location.href = "/login";
        }, 5000);
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
    
};