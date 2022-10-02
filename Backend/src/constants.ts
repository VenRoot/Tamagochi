import dotenv from "dotenv";
import path from "path";
dotenv.config({path: path.join(__dirname, "..", ".env")});

export default Object.seal({
    /**
     * @description URLs für Frontend und Backend
     */
    URLs: {
        frontend: process.env.FRONT_URL,
        backend: process.env.BACK_URL,
        mysql: process.env.MYSQL_URL
    },
    /**
     * @description MySql Daten
     */
    MySQL: {
        host: process.env.MYSQL_URL,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASS,
        database: process.env.MYSQL_DB
    },
    /**
     * @description Entrypoints for Backend API
     */
    urls: {
        /**
         * @description Entrypoint for getting a token
         */
        token: "/api/token",

        /**
         * @description Entrypoint for logging in
         */
        login: "/api/login",

        /**
         * @description Entrypoint for logging out
         */
        logout: "/api/logout",

        /**
         * @description Entrypoint for getting the user data
         */
        getUser: "/api/data",

        /**
         * @description Entrypoint for getting the Security Questions
         */
        getSicherheitsfragen: "/api/sicherheitsfragen",

        /**
         * @description Entrypoint for getting the Tamagochi
         */
        tamagochi: "/api/tamagochi",
    },
    paths:
    {
        Sicherheitsfragen: path.join(__dirname, "..", "data", "persistant_data", "Sicherheitsfragen.json")
    },
    tamagochi:
    {
        basePath: process.env.tamaBasePath
    }
})