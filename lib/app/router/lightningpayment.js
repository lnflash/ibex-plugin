"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = __importDefault(require("./app/middleware"));
const lightningpayment_1 = require("./app/controller/lightningpayment");
const router = express_1.default.Router();
router.post("/pay", middleware_1.default, lightningpayment_1.payInvoiceHandler);
router.get("/decode/:bolt11", middleware_1.default, lightningpayment_1.getInvoiceDecodedByBolt11Handler);
router.get("/fee/:bolt11", middleware_1.default, lightningpayment_1.getInvoiceFeeEstimationHandler);
router.get("/paymentInfo/:bolt11", middleware_1.default, lightningpayment_1.getPaymentInfoFromBolt11Handler);
router.post("/webhook", middleware_1.default, lightningpayment_1.payInvoiceWebhookHandler);
exports.default = router;
//# sourceMappingURL=lightningpayment.js.map