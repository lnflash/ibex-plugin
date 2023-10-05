"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const account_1 = require("@ibex/app/controller/account");
const express_1 = __importDefault(require("express"));
const middleware_1 = __importDefault(require("../middleware"));
const router = express_1.default.Router();
router.get("/", account_1.listAccountsHandler);
router.post("/", middleware_1.default, account_1.createAccountHandler);
router.put("/:accountId", middleware_1.default, account_1.updateAccountHandler);
router.get("/:accountId", account_1.getAccountByIdHandler);
// GET /users/:id - Get a user by ID
// router.get('/:id', getUserByIdHandler);
exports.default = router;
//# sourceMappingURL=account.js.map