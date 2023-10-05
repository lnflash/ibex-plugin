"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeLNURLHandler = exports.paylnurlHandler = exports.payInvoiceHandler = exports.invoiceRequirementHandler = exports.createLNURLHandler = void 0;
const helper_1 = require("./app/helper");
const axios_1 = __importDefault(require("axios"));
const domain_1 = require("./domain");
// import { insertLNURL } from '../model/lnurlpay';
async function createLNURLHandler(req, res) {
    const token = (0, helper_1.getToken)(req, res);
    try {
        const { accountId, currencyId, amount, webhookUrl, webhookSecret } = req.body;
        if (!((typeof amount === "number" || amount == undefined) && typeof accountId === "string")) {
            res.status(400).json({ error: "Invalid request body" });
            return;
        }
        const response = await axios_1.default.post(`${domain_1.IBEXEnum.BASE_URL}lnurl/pay`, { accountId, currencyId, amount, webhookUrl, webhookSecret }, {
            headers: { Authorization: token },
        });
        // await insertLNURL({ accountId, currencyId, amount, lnurl: response.data.lnurl })
        res.status(201).json({ message: "LNURL created successfully", data: response.data });
    }
    catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}
exports.createLNURLHandler = createLNURLHandler;
async function invoiceRequirementHandler(req, res) {
    const token = (0, helper_1.getToken)(req, res);
    try {
        const { k1 } = req.query;
        const response = await axios_1.default.get(`${domain_1.IBEXEnum.BASE_URL}lnurl/pay/invoice-requirements?k1=${k1}`, {
            headers: { Authorization: token },
        });
        res.status(201).json({ data: response.data });
    }
    catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}
exports.invoiceRequirementHandler = invoiceRequirementHandler;
async function payInvoiceHandler(req, res) {
    const token = (0, helper_1.getToken)(req, res);
    try {
        const { k1, amount, lnurl, comment } = req.query;
        const response = await axios_1.default.get(`${domain_1.IBEXEnum.BASE_URL}lnurl/pay/invoice`, {
            headers: { Authorization: token },
            params: { k1, amount, lnurl, comment },
        });
        res.status(200).json({ data: response.data });
    }
    catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}
exports.payInvoiceHandler = payInvoiceHandler;
async function paylnurlHandler(req, res) {
    const token = (0, helper_1.getToken)(req, res);
    try {
        const { params, amount, accountId } = req.body;
        if (!((typeof amount === "number" || amount == undefined) && typeof accountId === "string")) {
            res.status(400).json({ error: "Invalid request body" });
            return;
        }
        const response = await axios_1.default.post(`${domain_1.IBEXEnum.BASE_URL}v2/lnurl/pay/send`, { params, amount, accountId }, {
            headers: { Authorization: token },
        });
        res.status(201).json({ message: "Pay LNURL completed successfully", data: response.data });
    }
    catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}
exports.paylnurlHandler = paylnurlHandler;
async function decodeLNURLHandler(req, res) {
    const token = (0, helper_1.getToken)(req, res);
    try {
        const { lnurl } = req.query;
        const response = await axios_1.default.get(`${domain_1.IBEXEnum.BASE_URL}lnurl/decode/${lnurl}`, {
            headers: { Authorization: token },
        });
        res.status(200).json({ data: response.data });
    }
    catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}
exports.decodeLNURLHandler = decodeLNURLHandler;
//# sourceMappingURL=lnurlpay.js.map