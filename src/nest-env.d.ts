declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: string;
        PORT: string;

        // JWT env variables
        JWT_SECRET: string;
        JWT_EXPIRES_IN: string;
    }
}
