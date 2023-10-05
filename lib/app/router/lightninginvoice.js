"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = __importDefault(require("./app/middleware"));
const lightninginvoice_1 = require("./app/controller/lightninginvoice");
const router = express_1.default.Router();
router.post("/", middleware_1.default, lightninginvoice_1.createInvoiceHandler);
router.get("/:bolt11", middleware_1.default, lightninginvoice_1.getLightningInvoiceByBoult11Handler);
router.delete("/:bolt11", middleware_1.default, lightninginvoice_1.deleteLightningInvoiceHandler);
router.post("/webhook", lightninginvoice_1.receiveFundsWebhookHandler);
exports.default = router;
//# sourceMappingURL=lightninginvoice.js.map