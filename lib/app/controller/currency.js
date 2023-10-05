"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrencyHandler = void 0;
const domain_1 = require("./domain");
const axios_1 = __importDefault(require("axios"));
const helper_1 = require("./app/helper");
async function getCurrencyHandler(req, res) {
    const token = (0, helper_1.getToken)(req, res);
    try {
        const response = await axios_1.default.get(`${domain_1.IBEXEnum.BASE_URL}currency/all`, {
            headers: { Authorization: token },
        });
        res.status(200).json({
            data: response.data.currencies
                .filter((o) => o.accountEnabled)
                .map((o) => {
                return { id: o.id, name: o.name, symbol: o.symbol, isFiat: o.isFiat };
            }),
        });
    }
    catch (error) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
        console.log(error);
    }
}
exports.getCurrencyHandler = getCurrencyHandler;
//# sourceMappingURL=currency.js.map