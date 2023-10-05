"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = __importDefault(require("./app/middleware"));
const lnurlpay_1 = require("../controller/lnurlpay");
const router = express_1.default.Router();
router.post("/", middleware_1.default, lnurlpay_1.createLNURLHandler);
router.get("/invoiceRequirement", middleware_1.default, lnurlpay_1.invoiceRequirementHandler);
router.get("/pay", middleware_1.default, lnurlpay_1.payInvoiceHandler);
router.post("/paylnurl", middleware_1.default, lnurlpay_1.paylnurlHandler);
router.get("/decodeLNURL", middleware_1.default, lnurlpay_1.decodeLNURLHandler);
exports.default = router;
//# sourceMappingURL=lnurlpay.js.map