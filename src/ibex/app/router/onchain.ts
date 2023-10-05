import express, { Router } from "express";
import ibexAuthMiddleWare from "@ibex/app/middleware";
import {
  createBitcoinAddressHandler,
  estimateFeeHandler,
  sendStatsToBitcoinHandler,
  getTransactionDetails,
  receiveFundsWebhookHandler,
} from "@ibex/app/controller/onchain";

const router: Router = express.Router();

router.post("/", ibexAuthMiddleWare, createBitcoinAddressHandler);
router.get("/fee", ibexAuthMiddleWare, estimateFeeHandler);
router.post("/sendToAddress", ibexAuthMiddleWare, sendStatsToBitcoinHandler);
router.get("/:transactionId", ibexAuthMiddleWare, getTransactionDetails);
router.get("/webhook", receiveFundsWebhookHandler);

export default router;
