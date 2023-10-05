import express, { Router } from "express";
import ibexAuthMiddleWare from "@ibex/app/middleware";
import {
  createInvoiceHandler,
  deleteLightningInvoiceHandler,
  receiveFundsWebhookHandler,
  getLightningInvoiceByBoult11Handler,
} from "@ibex/app/controller/lightninginvoice";

const router: Router = express.Router();

router.post("/", ibexAuthMiddleWare, createInvoiceHandler);
router.get("/:bolt11", ibexAuthMiddleWare, getLightningInvoiceByBoult11Handler);
router.delete("/:bolt11", ibexAuthMiddleWare, deleteLightningInvoiceHandler);
router.post("/webhook", receiveFundsWebhookHandler);

export default router;
