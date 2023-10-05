"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = __importDefault(require("./app/middleware"));
const lightningaddress_1 = require("./app/controller/lightningaddress");
const router = express_1.default.Router();
router.post("/", middleware_1.default, lightningaddress_1.createLightningAddressHandler);
router.get("/:addressId", lightningaddress_1.getLightningAddressesByAccountIdHandler);
router.put("/:addressId", middleware_1.default, lightningaddress_1.updateLightningAddressHandler);
router.delete("/:addressId", middleware_1.default, lightningaddress_1.deleteLightningAddressHandler);
router.post("/webhook", middleware_1.default, lightningaddress_1.receiveFundsWebhookHandler);
exports.default = router;
//# sourceMappingURL=lightningaddress.js.map