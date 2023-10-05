"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiveFundsWebhookHandler = exports.deleteLightningInvoiceHandler = exports.getLightningInvoiceByBoult11Handler = exports.createInvoiceHandler = void 0;
const domain_1 = require("./domain");
const axios_1 = __importDefault(require("axios"));
const helper_1 = require("./app/helper");
const lightninginvoice_1 = require("./app/model/lightninginvoice");
async function createInvoiceHandler(req, res) {
    const token = (0, helper_1.getToken)(req, res);
    const { amount, accountId, memo, expiration, webhookUrl, webhookSecret } = req.body;
    if (!((typeof amount === "number" || amount == undefined) && typeof accountId === "string")) {
        res.status(400).json({ error: "Invalid request body" });
        return;
    }
    try {
        const response = await axios_1.default.post(`${domain_1.IBEXEnum.BASE_URL}v2/invoice/add`, { amount, accountId, memo, expiration, webhookUrl, webhookSecret }, {
            headers: { Authorization: token },
        });
        await (0, lightninginvoice_1.createLightningInvoice)(response.data);
        res.status(201).json({ message: "Lightning invoice created successfully", data: response.data });
    }
    catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}
exports.createInvoiceHandler = createInvoiceHandler;
async function getLightningInvoiceByBoult11Handler(req, res) {
    const token = (0, helper_1.getToken)(req, res);
    const { bolt11 } = req.params;
    if (!bolt11) {
        res.status(400).json({ error: "Invalid bolt11" });
        return;
    }
    try {
        // check in DB if invoice found then check if it is in open, then checking with ibex about its current status
        const dbData = await (0, lightninginvoice_1.getLightningInvoiceByBoult11)(bolt11);
        // if (!dbData) {
        //     res.status(404).json({ message: 'Invoice not found' });
        // } else if (dbData.invoice.state.id === InvoiceState.OPEN) {
        const response = await axios_1.default.get(`${domain_1.IBEXEnum.BASE_URL}invoice/from-bolt11/${bolt11}`, {
            headers: { Authorization: token },
        });
        await (0, lightninginvoice_1.updateLightningInvoiceByBoult11)(bolt11, response.data);
        res.status(200).json({ data: response.data });
        // } else {
        //     res.status(200).json({ data: dbData.invoice });
        // }
    }
    catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}
exports.getLightningInvoiceByBoult11Handler = getLightningInvoiceByBoult11Handler;
async function deleteLightningInvoiceHandler(req, res) {
    try {
        const token = (0, helper_1.getToken)(req, res);
        const { bolt11 } = req.params;
        await axios_1.default.delete(`${domain_1.IBEXEnum.BASE_URL}invoice/bolt11/${bolt11}`, {
            headers: { Authorization: token },
        });
        await (0, lightninginvoice_1.deleteLightningInvoice)(bolt11);
        res.status(200).json({ message: "Invoice deleted successfully" });
    }
    catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}
exports.deleteLightningInvoiceHandler = deleteLightningInvoiceHandler;
async function receiveFundsWebhookHandler(req, res) {
    try {
        const { webhookSecret, transaction } = req.body;
        if (webhookSecret == process.env.WEBHOOK_SECRET) {
            await (0, lightninginvoice_1.updateLightningInvoiceByBoult11)(transaction.invoice.bolt11, transaction.invoice, transaction.invoice.settleDateUtc);
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
//# sourceMappingURL=lightninginvoice.js.map