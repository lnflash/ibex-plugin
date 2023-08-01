import bolt11Lib from 'bolt11';
import { Request, Response } from 'express';
import { getToken } from '@ibex/app/helper'
import axios, { AxiosResponse } from 'axios';
import { IBEXEnum } from '@ibex/domain';
import { IbexPayInvoice, IbexPayInvoiceWebhookPayload, insertPaymentInfoHandler } from '@ibex/app/model/lightningpayment';
import { Invoice, updateLightningInvoiceByBoult11 } from '../model/lightninginvoice';




async function getInvoiceDecodedByBolt11Handler(req: Request, res: Response): Promise<void> {
    try {
        const { bolt11 } = req.params;
        const { millisatoshis, tags, timestamp } = bolt11Lib.decode(bolt11);
        res.send({
            data: {
                "amountMsat": millisatoshis,
                "timestamp": timestamp,
                "paymentHash": tags.find(o => o.tagName === 'payment_hash')?.data,
                "description": tags.find(o => o.tagName === 'description')?.data,
                "minFinalCLTVExpiry": tags.find(o => o.tagName === 'min_final_cltv_expiry')?.data,
                "expirationTime": tags.find(o => o.tagName === 'expire_time')?.data,
                "paymentSecret": tags.find(o => o.tagName === 'payment_secret')?.data,
                "routeHints": null
            }
        });

    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" })
    }
}


async function getInvoiceFeeEstimationHandler(req: Request, res: Response): Promise<void> {
    const token = getToken(req, res);
    try {
        const { bolt11 } = req.params;
        const { amount, currencyId } = req.query;

        const response: AxiosResponse<{ amount: number }> = await axios.get(`${IBEXEnum.BASE_URL}v2/invoice/estimate-fee`, {
            headers: { Authorization: token },
            params: { bolt11, amount, currencyId }
        });
        await updateLightningInvoiceByBoult11(bolt11, undefined, undefined, response.data.amount)
        res.status(200).json({ data: response.data });
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}


async function payInvoiceHandler(req: Request, res: Response): Promise<void> {
    const token = getToken(req, res);
    try {
        const { accountId, bolt11, amount, webhookUrl, webhookSecret } = req.body;
        if (!(typeof accountId === "string" && typeof bolt11 === "string" || (amount && typeof amount === 'number') || (amount && typeof webhookUrl === 'string') || (amount && typeof webhookSecret === 'string'))) {
            res.status(400).json({ error: "Invalid request body" });
            return;
        }
        const paymentRes: AxiosResponse<IbexPayInvoice> = await axios.post(`${IBEXEnum.BASE_URL}v2/invoice/pay`, { accountId, bolt11, amount, webhookUrl, webhookSecret }, {
            headers: { Authorization: token }
        });
        await insertPaymentInfoHandler(paymentRes.data);

        const invoiceRes: AxiosResponse<Invoice> = await axios.get(`${IBEXEnum.BASE_URL}invoice/from-bolt11/${bolt11}`, {
            headers: { Authorization: token },
        });

        await updateLightningInvoiceByBoult11(bolt11, invoiceRes.data, paymentRes.data.transaction.payment.settleDateUtc)


        res.status(200).json({ data: paymentRes.data });
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}

async function getPaymentInfoFromBolt11Handler(req: Request, res: Response): Promise<void> {
    const token = getToken(req, res);
    try {
        const { bolt11 } = req.params;

        const response: AxiosResponse<{ amount: number }> = await axios.get(`${IBEXEnum.BASE_URL}payment/from-bolt11/${bolt11}`, {
            headers: { Authorization: token }
        });
        res.status(200).json({ data: response.data });
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}


async function payInvoiceWebhookHandler(req: Request, res: Response): Promise<void> {
    const token = getToken(req, res);
    try {
        const { webhookSecret, transaction }: IbexPayInvoiceWebhookPayload = req.body;
        if (webhookSecret == process.env.WEBHOOK_SECRET) {

            await insertPaymentInfoHandler({
                settleAtUtc: new Date(transaction.payment.settleDateUtc).getTime(),
                hash: transaction.payment.hash,
                status: transaction.payment.status.id,
                failureReason: transaction.payment.failureId,
                transaction
            });
            const invoiceRes: AxiosResponse<Invoice> = await axios.get(`${IBEXEnum.BASE_URL}invoice/from-bolt11/${transaction.payment.bolt11}`, {
                headers: { Authorization: token },
            });

            await updateLightningInvoiceByBoult11(transaction.payment.bolt11, invoiceRes.data, transaction.payment.settleDateUtc)

            res.status(200).send({"msg": "Transaction Successful"})
        } else {
            res.status(401).send({ error: 'Invalid Secret' });
        }
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}

export { getInvoiceDecodedByBolt11Handler, getInvoiceFeeEstimationHandler, payInvoiceHandler, getPaymentInfoFromBolt11Handler, payInvoiceWebhookHandler };