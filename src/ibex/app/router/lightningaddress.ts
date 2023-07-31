import express, { Router } from 'express';
import ibexAuthMiddleWare from '@ibex/app/middleware';
import { createLightningAddressHandler, deleteLightningAddressHandler, getLightningAddressesByAccountIdHandler, updateLightningAddressHandler, receiveFundsWebhookHandler } from '@ibex/app/controller/lightningaddress';

const router: Router = express.Router();

router.post('/', ibexAuthMiddleWare, createLightningAddressHandler);
router.get('/:addressId', getLightningAddressesByAccountIdHandler);
router.put('/:addressId', ibexAuthMiddleWare, updateLightningAddressHandler);
router.delete('/:addressId', ibexAuthMiddleWare, deleteLightningAddressHandler);
router.post('/webhook', ibexAuthMiddleWare, receiveFundsWebhookHandler);


export default router;
