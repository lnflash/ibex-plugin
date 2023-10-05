"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const domain_1 = require("./domain");
const ibexAuthMiddleWare = (req, res, next) => {
    axios_1.default
        .post(`${domain_1.IBEXEnum.BASE_URL}auth/signin`, {
        email: process.env.IBEX_EMAIL,
        password: process.env.IBEX_PASSWORD,
    })
        .then((response) => {
        // Handle the API response here
        req.headers.authorization = `${response.data.accessToken}`;
        // Call next() to pass control to the next middleware function
        next();
    })
        .catch((error) => {
        // Handle API call errors here
        console.error("API error:", error);
        // You can choose to pass the error to an error handler middleware or handle it accordingly
        next(error);
    });
};
exports.default = ibexAuthMiddleWare;
//# sourceMappingURL=index.js.map