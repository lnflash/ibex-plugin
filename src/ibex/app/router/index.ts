import express, { Router } from 'express';
import accountRoutes from '@ibex/app/router/account';
import lightningAddressRouter from '@ibex/app/router/lightningaddress';
import lightningInvoiceRouter from '@ibex/app/router/lightninginvoice';
import lightningPaymentRouter from '@ibex/app/router/lightningpayment';
import currencyRouter from '@ibex/app/router/currency';
import onchainRouter from '@ibex/app/router/onchain';


const router: Router = express.Router();

router.use('/account', accountRoutes);
router.use('/lightningAddress', lightningAddressRouter);
router.use('/lightningInvoice', lightningInvoiceRouter);
router.use('/lightningPayment', lightningPaymentRouter);
router.use('/currency', currencyRouter);
router.use('/onchain', onchainRouter);

export default router;