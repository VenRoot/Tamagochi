declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production' | 'test';
            PORT: string;
            MONGO_URI: string;
            JWT_SECRET: string;

            FRONT_URL: string;
            BACK_URL: string;
            MYSQL_URL: string;

            tamaBasePath: string;
            sessionEncryptionKey: string;
        }
    }
}

export {};