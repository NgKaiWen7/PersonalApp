
const path = require("node:path");
const dotenv = require("dotenv");

const projectDir = "/home/nkw/NuxtPersonalApp";

const result = dotenv.config({
    path: path.join(projectDir, ".env"),
    override: true,
});

if (result.error) {
    throw result.error;
}

console.log("Loaded DB configuration:", {
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME,
});

module.exports = {
    apps: [
        {
            name: "nuxt-personal-app",
            cwd: projectDir,
            script: ".output/server/index.mjs",

            instances: 1,
            exec_mode: "fork",

            env: {
                NODE_ENV: "production",
                HOST: "127.0.0.1",
                PORT: 3000,

                DB_HOST: process.env.DB_HOST,
                DB_PORT: process.env.DB_PORT,
                DB_USER: process.env.DB_USER,
                DB_PASSWORD: process.env.DB_PASSWORD,
                DB_NAME: process.env.DB_NAME,
            },

            autorestart: true,
            watch: false,
            max_memory_restart: "1G",
        },
    ],
};
