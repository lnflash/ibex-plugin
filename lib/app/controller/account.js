"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listAccountsHandler = exports.updateAccountHandler = exports.getAccountByIdHandler = exports.createAccountHandler = void 0;
const helper_1 = require("@ibex/app/helper");
const account_1 = require("@ibex/app/model/account");
const domain_1 = require("@ibex/domain");
const axios_1 = __importDefault(require("axios"));
async function createAccountHandler(req, res) {
    try {
        const token = (0, helper_1.getToken)(req, res);
        // Check if the request body conforms to the expected structure
        const { name, currencyId } = req.body;
        if (!(typeof name === "string" && typeof currencyId === "number")) {
            res.status(400).json({ error: "Invalid request body" });
            return;
        }
        const response = await axios_1.default.post(`${domain_1.IBEXEnum.BASE_URL}account/create`, { name, currencyId }, {
            headers: { Authorization: token },
        });
        await (0, account_1.createAccount)(response.data);
        res.status(201).json({ message: "Account created successfully", data: response.data });
    }
    catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}
exports.createAccountHandler = createAccountHandler;
async function getAccountByIdHandler(req, res) {
    try {
        const { accountId } = req.params;
        const account = await (0, account_1.getAccountById)(accountId);
        if (!account) {
            res.status(404).json({ message: "Account not found" });
        }
        else {
            res.status(200).json({ account });
        }
    }
    catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}
exports.getAccountByIdHandler = getAccountByIdHandler;
async function updateAccountHandler(req, res) {
    try {
        const token = (0, helper_1.getToken)(req, res);
        const { accountId } = req.params;
        const requestBody = req.body;
        if (!(typeof requestBody.name === "string")) {
            res.status(400).json({ error: "Invalid request body" });
            return;
        }
        const response = await axios_1.default.put(`${domain_1.IBEXEnum.BASE_URL}account/${accountId}`, requestBody, {
            headers: { Authorization: token },
        });
        if (!response) {
            res.status(404).json({ message: "Account not found" });
        }
        else {
            await (0, account_1.updateAccount)(accountId, requestBody);
            res.status(200).json({ message: "Account updated successfully" });
        }
    }
    catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}
exports.updateAccountHandler = updateAccountHandler;
async function listAccountsHandler(req, res) {
    try {
        const accounts = await (0, account_1.listAccounts)();
        res.status(200).json({ accounts });
    }
    catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}
exports.listAccountsHandler = listAccountsHandler;
//# sourceMappingURL=account.js.map