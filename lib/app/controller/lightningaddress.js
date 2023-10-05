"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiveFundsWebhookHandler = exports.deleteLightningAddressHandler = exports.updateLightningAddressHandler = exports.getLightningAddressesByAccountIdHandler = exports.createLightningAddressHandler = void 0;
const helper_1 = require("./app/helper");
const domain_1 = require("./domain");
const axios_1 = __importDefault(require("axios"));
const lightningaddress_1 = require("./app/model/lightningaddress");
const lightningpayment_1 = require("../model/lightningpayment");
const lightninginvoice_1 = require("../model/lightninginvoice");
async function createLightningAddressHandler(req, res) {
    try {
        const token = (0, helper_1.getToken)(req, res);
        // Check if the request body conforms to the expected structure
        const { username, accountId, webhookUrl, webhookSecret } = req.body;
        if (!(typeof username === "string" && typeof accountId === "string")) {
            res.status(400).json({ error: "Invalid request body" });
            return;
        }
        const response = await axios_1.default.post(`${domain_1.IBEXEnum.BASE_URL}lightning-address`, { username, accountId, webhookUrl, webhookSecret }, {
            headers: { Authorization: token },
        });
        await (0, lightningaddress_1.createLightningAddress)(response.data);
        res.status(201).json({ message: "Lightning address created successfully", data: response.data });
    }
    catch (error) {
        console.log({ error });
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}
exports.createLightningAddressHandler = createLightningAddressHandler;
async function getLightningAddressesByAccountIdHandler(req, res) {
    try {
        const { addressId } = req.params;
        const lightningAddress = await (0, lightningaddress_1.getLightningAddressesByAccountById)(addressId);
        if (!lightningAddress) {
            res.status(404).json({ message: "Address not found" });
        }
        else {
            res.status(200).json({ lightningAddress });
        }
    }
    catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}
exports.getLightningAddressesByAccountIdHandler = getLightningAddressesByAccountIdHandler;
async function updateLightningAddressHandler(req, res) {
    try {
        const token = (0, helper_1.getToken)(req, res);
        const { addressId } = req.params;
        const requestBody = req.body;
        if (!(typeof requestBody.username === "string")) {
            res.status(400).json({ error: "Invalid request body" });
            return;
        }
        const response = await axios_1.default.put(`${domain_1.IBEXEnum.BASE_URL}lightning-address/${addressId}`, requestBody, {
            headers: { Authorization: token },
        });
        if (!response) {
            res.status(404).json({ message: "Address not found" });
        }
        else {
            await (0, lightningaddress_1.updateLightningAddress)(addressId, requestBody);
            res.status(200).json({ message: "Account updated successfully" });
        }
    }
    catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}
exports.updateLightningAddressHandler = updateLightningAddressHandler;
async function deleteLightningAddressHandler(req, res) {
    try {
        const token = (0, helper_1.getToken)(req, res);
        const { addressId } = req.params;
        await axios_1.default.delete(`${domain_1.IBEXEnum.BASE_URL}lightning-address/${addressId}`, {
            headers: { Authorization: token },
        });
        await (0, lightningaddress_1.deleteLightningAddress)(addressId);
        res.status(200).json({ message: "Address deleted successfully" });
    }
    catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}
exports.deleteLightningAddressHandler = deleteLightningAddressHandler;
async function receiveFundsWebhookHandler(req, res) {
    const token = (0, helper_1.getToken)(req, res);
    try {
        const { webhookSecret, transaction } = req.body;
        if (webhookSecret == process.env.WEBHOOK_SECRET) {
            await (0, lightningpayment_1.insertPaymentInfoHandler)({
                settleAtUtc: new Date(transaction.payment.settleDateUtc).getTime(),
                hash: transaction.payment.hash,
                status: transaction.payment.status.id,
                failureReason: transaction.payment.failureId,
                transaction,
            });
            const invoiceRes = await axios_1.default.get(`${domain_1.IBEXEnum.BASE_URL}invoice/from-bolt11/${transaction.payment.bolt11}`, {
                headers: { Authorization: token },
            });
            await (0, lightninginvoice_1.updateLightningInvoiceByBoult11)(transaction.payment.bolt11, invoiceRes.data, transaction.payment.settleDateUtc);
            res.status(200).send({ msg: "Transaction Successful" });
        }
        else {
            res.status(401).send({ error: "Invalid Secret" });
        }
    }
    catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}
exports.receiveFundsWebhookHandler = receiveFundsWebhookHandler;
//# sourceMappingURL=lightningaddress.js.map