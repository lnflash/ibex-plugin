import express, { Router } from 'express';
import ibexAuthMiddleWare from '@ibex/app/middleware';
import { getInvoiceDecodedByBolt11Handler, getInvoiceFeeEstimationHandler, getPaymentInfoFromBolt11Handler, payInvoiceHandler, payInvoiceWebhookHandler } from '@ibex/app/controller/lightningpayment';

const router: Router = express.Router();


router.post('/pay', ibexAuthMiddleWare, payInvoiceHandler)
router.get('/decode/:bolt11', ibexAuthMiddleWare,  getInvoiceDecodedByBolt11Handler);
router.get('/fee/:bolt11', ibexAuthMiddleWare,  getInvoiceFeeEstimationHandler);
router.get('/paymentInfo/:bolt11', ibexAuthMiddleWare,  getPaymentInfoFromBolt11Handler);
router.post('/webhook', ibexAuthMiddleWare, payInvoiceWebhookHandler)

export default router;
