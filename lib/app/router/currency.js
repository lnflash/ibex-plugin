"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = __importDefault(require("@ibex/app/middleware"));
const currency_1 = require("@ibex/app/controller/currency");
const router = express_1.default.Router();
router.get("/", middleware_1.default, currency_1.getCurrencyHandler);
exports.default = router;
//# sourceMappingURL=currency.js.map