"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiveFundsWebhookHandler = exports.getTransactionDetails = exports.sendStatsToBitcoinHandler = exports.estimateFeeHandler = exports.createBitcoinAddressHandler = void 0;
const helper_1 = require("./app/helper");
const axios_1 = __importDefault(require("axios"));
const domain_1 = require("./domain");
async function createBitcoinAddressHandler(req, res) {
    const token = (0, helper_1.getToken)(req, res);
    try {
        const { accountId, webhookUrl, webhookSecret } = req.body;
        if (!(typeof accountId === "string")) {
            res.status(400).json({ error: "Invalid request body" });
            return;
        }
        const response = await axios_1.default.post(`${domain_1.IBEXEnum.BASE_URL}onchain/address`, { accountId, webhookUrl, webhookSecret }, {
            headers: { Authorization: token },
        });
        // await insertAddress(accountId, response.data.address);
        res.status(201).json({ message: "Address created successfully", data: response.data.address });
    }
    catch (error) {
        console.log({ error });
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}
exports.createBitcoinAddressHandler = createBitcoinAddressHandler;
async function estimateFee(token, address, amount, currency = 0) {
    try {
        const response = await axios_1.default.get(`${domain_1.IBEXEnum.BASE_URL}v2/onchain/estimate-fee`, {
            headers: { Authorization: token },
            params: { address, amount, currency },
        });
        return response.data.feeSat;
    }
    catch (error) {
        console.log({ error });
        throw error;
    }
}
async function estimateFeeHandler(req, res) {
    const token = (0, helper_1.getToken)(req, res);
    try {
        const { address, amount } = req.query;
        if (!(typeof address === "string" && amount)) {
            res.status(400).json({ error: "Invalid request body" });
            return;
        }
        const feeSat = await estimateFee(token, address, +amount);
        res.status(200).json({ data: feeSat });
    }
    catch (error) {
        console.log({ error });
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}
exports.estimateFeeHandler = estimateFeeHandler;
async function sendStatsToBitcoinHandler(req, res) {
    const token = (0, helper_1.getToken)(req, res);
    try {
        const { accountId, address, amount, webhookUrl, webhookSecret } = req.body;
        if (!(typeof accountId === "string" && typeof address === "string" && typeof amount === "number")) {
            res.status(400).json({ error: "Invalid request body" });
            return;
        }
        // const feeSat = await estimateFee(token, address, amount);
        const response = await axios_1.default.post(`${domain_1.IBEXEnum.BASE_URL}v2/onchain/send`, { accountId, address, amount, webhookUrl, webhookSecret }, {
            headers: { Authorization: token },
        });
        // await insertTransaction(accountId, address, response.data);
        res.status(200).json({ data: response.data });
    }
    catch (error) {
        console.log({ error });
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}
exports.sendStatsToBitcoinHandler = sendStatsToBitcoinHandler;
async function getTransactionDetails(req, res) {
    const token = (0, helper_1.getToken)(req, res);
    try {
        const { transactionId } = req.params;
        const response = await axios_1.default.get(`${domain_1.IBEXEnum.BASE_URL}v2/transaction/${transactionId}`, {
            headers: { Authorization: token },
        });
        res.status(200).json({ data: response.data });
    }
    catch (error) {
        console.log({ error });
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}
exports.getTransactionDetails = getTransactionDetails;
async function receiveFundsWebhookHandler(req, res) {
    const token = (0, helper_1.getToken)(req, res);
    try {
        const { webhookSecret, ...body } = req.body;
        if (webhookSecret == process.env.WEBHOOK_SECRET) {
            res.status(200).send({ msg: "Transaction Successful" });
        }
        else {
            res.status(401).send({ error: "Invalid Secret" });
        }
    }
    catch (error) {
        console.log({ error });
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}
exports.receiveFundsWebhookHandler = receiveFundsWebhookHandler;
//# sourceMappingURL=onchain.js.map