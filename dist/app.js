"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
// import { Logger } from "concurrently";
const client_1 = require("@prisma/client");
const logger_1 = __importDefault(require("./utils/logger"));
const error_middleware_1 = __importDefault(require("./middleware/error.middleware"));
class App {
    constructor(port) {
        this.express = (0, express_1.default)();
        this.port = port;
        this.initialiseMiddleware();
        this.initialiseDatabase();
        this.initialiseErrorMiddleware();
        // this.initialiseController()
    }
    initialiseMiddleware() {
        this.express.use((0, helmet_1.default)());
        this.express.use((0, compression_1.default)());
        this.express.use((0, cors_1.default)());
        this.express.use((0, morgan_1.default)("dev"));
        this.express.use(express_1.default.json());
        this.express.use((0, express_1.urlencoded)({ extended: true }));
    }
    // private initialiseController(): void {
    //   this.express.use('/api')
    // }
    initialiseErrorMiddleware() {
        this.express.use(error_middleware_1.default);
    }
    initialiseDatabase() {
        const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_PATH } = process.env;
        // Use these variables for PostgreSQL connection
        this.prisma = new client_1.PrismaClient({
            datasources: {
                db: {
                    url: `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}${POSTGRES_PATH}`,
                },
            },
        });
    }
    listen() {
        this.prisma.$connect();
        this.express.listen(this.port, () => {
            logger_1.default.info(`App is listening on port ${this.port}`);
        });
    }
}
exports.default = App;
