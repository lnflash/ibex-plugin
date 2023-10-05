"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.payInvoiceWebhookHandler = exports.getPaymentInfoFromBolt11Handler = exports.payInvoiceHandler = exports.getInvoiceFeeEstimationHandler = exports.getInvoiceDecodedByBolt11Handler = void 0;
const bolt11_1 = __importDefault(require("bolt11"));
const helper_1 = require("@ibex/app/helper");
const axios_1 = __importDefault(require("axios"));
const domain_1 = require("@ibex/domain");
async function getInvoiceDecodedByBolt11Handler(req, res) {
    try {
        const { bolt11 } = req.params;
        const { millisatoshis, tags, timestamp } = bolt11_1.default.decode(bolt11);
        res.send({
            data: {
                amountMsat: millisatoshis,
                timestamp: timestamp,
                paymentHash: tags.find((o) => o.tagName === "payment_hash")?.data,
                description: tags.find((o) => o.tagName === "description")?.data,
                minFinalCLTVExpiry: tags.find((o) => o.tagName === "min_final_cltv_expiry")?.data,
                expirationTime: tags.find((o) => o.tagName === "expire_time")?.data,
                paymentSecret: tags.find((o) => o.tagName === "payment_secret")?.data,
                routeHints: null,
            },
        });
    }
    catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}
exports.getInvoiceDecodedByBolt11Handler = getInvoiceDecodedByBolt11Handler;
async function getInvoiceFeeEstimationHandler(req, res) {
    const token = (0, helper_1.getToken)(req, res);
    try {
        const { bolt11 } = req.params;
        const { amount, currencyId } = req.query;
        const response = await axios_1.default.get(`${domain_1.IBEXEnum.BASE_URL}v2/invoice/estimate-fee`, {
            headers: { Authorization: token },
            params: { bolt11, amount, currencyId },
        });
        // await updateLightningInvoiceByBoult11(bolt11, undefined, undefined, response.data.amount);
        res.status(200).json({ data: response.data });
    }
    catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}
exports.getInvoiceFeeEstimationHandler = getInvoiceFeeEstimationHandler;
async function payInvoiceHandler(req, res) {
    const token = (0, helper_1.getToken)(req, res);
    try {
        const { accountId, bolt11, amount, webhookUrl, webhookSecret } = req.body;
        if (!((typeof accountId === "string" && typeof bolt11 === "string") ||
            (amount && typeof amount === "number") ||
            (amount && typeof webhookUrl === "string") ||
            (amount && typeof webhookSecret === "string"))) {
            res.status(400).json({ error: "Invalid request body" });
            return;
        }
        const paymentRes = await axios_1.default.post(`${domain_1.IBEXEnum.BASE_URL}v2/invoice/pay`, { accountId, bolt11, amount, webhookUrl, webhookSecret }, {
            headers: { Authorization: token },
        });
        // await insertPaymentInfoHandler(paymentRes.data);
        // const invoiceRes: AxiosResponse<Invoice> = await axios.get(`${IBEXEnum.BASE_URL}invoice/from-bolt11/${bolt11}`, {
        //   headers: { Authorization: token },
        // });
        // await updateLightningInvoiceByBoult11(bolt11, invoiceRes.data, paymentRes.data.transaction.payment.settleDateUtc);
        res.status(200).json({ data: paymentRes.data });
    }
    catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}
exports.payInvoiceHandler = payInvoiceHandler;
async function getPaymentInfoFromBolt11Handler(req, res) {
    const token = (0, helper_1.getToken)(req, res);
    try {
        const { bolt11 } = req.params;
        const response = await axios_1.default.get(`${domain_1.IBEXEnum.BASE_URL}payment/from-bolt11/${bolt11}`, {
            headers: { Authorization: token },
        });
        res.status(200).json({ data: response.data });
    }
    catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}
exports.getPaymentInfoFromBolt11Handler = getPaymentInfoFromBolt11Handler;
async function payInvoiceWebhookHandler(req, res) {
    const token = (0, helper_1.getToken)(req, res);
    try {
        const { webhookSecret, transaction } = req.body;
        if (webhookSecret == process.env.WEBHOOK_SECRET) {
            // await insertPaymentInfoHandler({
            //     settleAtUtc: new Date(transaction.payment.settleDateUtc).getTime(),
            //     hash: transaction.payment.hash,
            //     status: transaction.payment.status.id,
            //     failureReason: transaction.payment.failureId,
            //     transaction
            // });
            const invoiceRes = await axios_1.default.get(`${domain_1.IBEXEnum.BASE_URL}invoice/from-bolt11/${transaction.payment.bolt11}`, {
                headers: { Authorization: token },
            });
            // await updateLightningInvoiceByBoult11(transaction.payment.bolt11, invoiceRes.data, transaction.payment.settleDateUtc)
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
exports.payInvoiceWebhookHandler = payInvoiceWebhookHandler;
//# sourceMappingURL=lightningpayment.js.map