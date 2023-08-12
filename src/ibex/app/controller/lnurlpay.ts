import { Request, Response } from 'express';
import { getToken } from '@ibex/app/helper'
import axios, { AxiosResponse } from 'axios';
import { IBEXEnum } from '@ibex/domain';
import { insertLNURL } from '../model/lnurlpay';

async function createLNURLHandler(req: Request, res: Response): Promise<void> {

    const token = getToken(req, res);
    try {
        const { accountId, currencyId, amount, webhookUrl, webhookSecret } = req.body;

        if (!((typeof amount === "number" || amount == undefined) && typeof accountId === "string")) {
            res.status(400).json({ error: "Invalid request body" });
            return;
        }

        const response: AxiosResponse<{ lnurl: string }> = await axios.post(`${IBEXEnum.BASE_URL}lnurl/pay`, { accountId, currencyId, amount, webhookUrl, webhookSecret }, {
            headers: { Authorization: token },
        });

        await insertLNURL({ accountId, currencyId, amount, lnurl: response.data.lnurl })

        res.status(201).json({ message: 'LNURL created successfully', data: response.data });
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }

}

async function invoiceRequirementHandler(req: Request, res: Response): Promise<void> {
    const token = getToken(req, res);
    try {
        const { k1 } = req.query;

        const response: AxiosResponse<{ callback: string, maxSendable: number, minSendable: number, metadata: string, tag: string }> = await axios.get(`${IBEXEnum.BASE_URL}lnurl/pay/invoice-requirements?k1=${k1}`, {
            headers: { Authorization: token },
        });

        res.status(201).json({ data: response.data });
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}

async function payInvoiceHandler(req: Request, res: Response): Promise<void> {
    const token = getToken(req, res);
    try {

        const { k1, amount, lnurl, comment} = req.query;
        const response: AxiosResponse<{ pr:string, routes: string[] }> = await axios.get(`${IBEXEnum.BASE_URL}lnurl/pay/invoice`, {
            headers: { Authorization: token },
            params: {k1, amount, lnurl, comment}
        });

        res.status(200).json({ data: response.data });
    }  catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}

async function paylnurlHandler(req: Request, res: Response): Promise<void> {
    const token = getToken(req, res);
    try {

        const { params, amount, accountId } = req.body;

        if (!((typeof amount === "number" || amount == undefined) && typeof accountId === "string")) {
            res.status(400).json({ error: "Invalid request body" });
            return;
        }

        const response: AxiosResponse<{ lnurl: string }> = await axios.post(`${IBEXEnum.BASE_URL}v2/lnurl/pay/send`, { params, amount, accountId }, {
            headers: { Authorization: token },
        });

        res.status(201).json({ message: 'Pay LNURL compleated successfully', data: response.data });
    }  catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}

async function decodeLNURLHandler(req: Request, res: Response): Promise<void> {
    const token = getToken(req, res);
    try {
        const { lnurl } = req.query;
        const response: AxiosResponse<{ pr:string, routes: string[] }> = await axios.get(`${IBEXEnum.BASE_URL}lnurl/decode/${lnurl}`, {
            headers: { Authorization: token },
        });

        res.status(200).json({ data: response.data });
    }  catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}

export { createLNURLHandler, invoiceRequirementHandler, payInvoiceHandler, paylnurlHandler, decodeLNURLHandler }
