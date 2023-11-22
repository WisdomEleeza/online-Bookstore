"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = require("envalid");
function validateEnv() {
    (0, envalid_1.cleanEnv)(process.env, {
        NODE_ENV: (0, envalid_1.str)({
            choices: ["development", "production"],
        }),
        POSTGRES_DB: (0, envalid_1.str)(),
        POSTGRES_PASSWORD: (0, envalid_1.str)(),
        POSTGRES_PATH: (0, envalid_1.str)(),
        PORT: (0, envalid_1.port)({ default: 8000 }),
    });
}
exports.default = validateEnv;
