"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = __importDefault(require("@ibex/app/middleware"));
const onchain_1 = require("@ibex/app/controller/onchain");
const router = express_1.default.Router();
router.post("/", middleware_1.default, onchain_1.createBitcoinAddressHandler);
router.get("/fee", middleware_1.default, onchain_1.estimateFeeHandler);
router.post("/sendToAddress", middleware_1.default, onchain_1.sendStatsToBitcoinHandler);
router.get("/:transactionId", middleware_1.default, onchain_1.getTransactionDetails);
router.get("/webhook", onchain_1.receiveFundsWebhookHandler);
exports.default = router;
//# sourceMappingURL=onchain.js.map