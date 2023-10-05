"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const account_1 = __importDefault(require("@ibex/app/router/account"));
const lightningaddress_1 = __importDefault(require("@ibex/app/router/lightningaddress"));
const lightninginvoice_1 = __importDefault(require("@ibex/app/router/lightninginvoice"));
const lightningpayment_1 = __importDefault(require("@ibex/app/router/lightningpayment"));
const currency_1 = __importDefault(require("@ibex/app/router/currency"));
const onchain_1 = __importDefault(require("@ibex/app/router/onchain"));
const lnurlpay_1 = __importDefault(require("@ibex/app/router/lnurlpay"));
const router = express_1.default.Router();
router.use("/account", account_1.default);
router.use("/lightningAddress", lightningaddress_1.default);
router.use("/lightningInvoice", lightninginvoice_1.default);
router.use("/lightningPayment", lightningpayment_1.default);
router.use("/currency", currency_1.default);
router.use("/onchain", onchain_1.default);
router.use("/lnurl", lnurlpay_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map