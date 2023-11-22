"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const register = joi_1.default.object({
    name: joi_1.default.string().max(255),
    email: joi_1.default.string().max(255).required(),
    password: joi_1.default.string().min(8).required(),
});
const login = joi_1.default.object({
    email: joi_1.default.string().max(255).required(),
    password: joi_1.default.string().min(8).required(),
});
module.exports = { register, login };
