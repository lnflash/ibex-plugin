import express, { Router } from "express";
import ibexAuthMiddleWare from "@ibex/app/middleware";
import { createLNURLHandler, invoiceRequirementHandler, payInvoiceHandler, paylnurlHandler, decodeLNURLHandler } from "../controller/lnurlpay";

const router: Router = express.Router();

router.post("/", ibexAuthMiddleWare, createLNURLHandler);
router.get("/invoiceRequirement", ibexAuthMiddleWare, invoiceRequirementHandler);
router.get("/pay", ibexAuthMiddleWare, payInvoiceHandler);
router.post("/paylnurl", ibexAuthMiddleWare, paylnurlHandler);
router.get("/decodeLNURL", ibexAuthMiddleWare, decodeLNURLHandler);

export default router;
