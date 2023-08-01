import { IBEXEnum } from '@ibex/domain';
import axios, { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { getToken } from '@ibex/app/helper';
import { IBEXLightningInvoice, Invoice, IBEXLightningInvoiceWebhookPayload, InvoiceState, createLightningInvoice, deleteLightningInvoice, getLightningInvoiceByBoult11, updateLightningInvoiceByBoult11 } from '@ibex/app/model/lightninginvoice';

async function createInvoiceHandler(req: Request, res: Response): Promise<void> {
    const token = getToken(req, res);
    const { amount, accountId, memo, expiration, webhookUrl, webhookSecret } = req.body;

    if (!((typeof amount === "number" || amount == undefined) && typeof accountId === "string")) {
        res.status(400).json({ error: "Invalid request body" });
        return;
    }

    try {
        const response: AxiosResponse<IBEXLightningInvoice> = await axios.post(`${IBEXEnum.BASE_URL}v2/invoice/add`, { amount, accountId, memo, expiration, webhookUrl, webhookSecret }, {
            headers: { Authorization: token },
        });
        await createLightningInvoice(response.data);
        res.status(201).json({ message: 'Lightning invoice created successfully', data: response.data });
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}


async function getLightningInvoiceByBoult11Handler(req: Request, res: Response): Promise<void> {
    const token = getToken(req, res);

    const { bolt11 } = req.params;
    if (!bolt11) {
        res.status(400).json({ error: "Invalid bolt11" });
        return;
    }
    try {
        // check in DB if invoice found then check if it is in open, then checking with ibex about its current status
        const dbData = await getLightningInvoiceByBoult11(bolt11);
        if (!dbData) {
            res.status(404).json({ message: 'Invoice not found' });
        } else if (dbData.invoice.state.id === InvoiceState.OPEN) {
            const response: AxiosResponse<Invoice> = await axios.get(`${IBEXEnum.BASE_URL}invoice/from-bolt11/${bolt11}`, {
                headers: { Authorization: token },
            });
            await updateLightningInvoiceByBoult11(bolt11, response.data)
            res.status(200).json({ data: response.data });
        } else {
            res.status(200).json({ data: dbData.invoice });
        }

    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}


async function deleteLightningInvoiceHandler(req: Request, res: Response): Promise<void> {
    try {
        const token = getToken(req, res);
        const { bolt11 } = req.params;
        await axios.delete(`${IBEXEnum.BASE_URL}invoice/bolt11/${bolt11}`, {
            headers: { Authorization: token },
        });
        await deleteLightningInvoice(bolt11);
        res.status(200).json({ message: 'Invoice deleted successfully' });
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}


async function receiveFundsWebhookHandler(req: Request, res: Response): Promise<void> {
    
    try {
        const { webhookSecret, transaction }: IBEXLightningInvoiceWebhookPayload = req.body;
        if (webhookSecret == process.env.WEBHOOK_SECRET) {

            await updateLightningInvoiceByBoult11(transaction.invoice.bolt11, transaction.invoice, transaction.invoice.settleDateUtc)
            
            res.status(200).send({"msg": "Transaction Successful"})

        } else {
            res.status(401).send({ error: 'Invalid Secret' });
        }
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}

export { createInvoiceHandler, getLightningInvoiceByBoult11Handler, deleteLightningInvoiceHandler, receiveFundsWebhookHandler }