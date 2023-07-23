import express, { Router } from 'express';
import accountRoutes from '@ibex/app/router/account';
import lightningAddressRouter from '@ibex/app/router/lightningaddress';

const router: Router = express.Router();

router.use('/account', accountRoutes);
router.use('/lightningPayment', lightningAddressRouter);

export default router;