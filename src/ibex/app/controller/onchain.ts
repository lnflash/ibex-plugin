import { Request, Response } from 'express';
import { getToken } from '@ibex/app/helper'
import axios, { AxiosResponse } from 'axios';
import { IBEXEnum } from '@ibex/domain';
import { IbexOnchainTransaction, IbexOnchainTransactionWebhookPayload, insertAddress, insertTransaction } from '@ibex/app/model/onchain';

async function createBitcoinAddressHandler(req: Request, res: Response): Promise<void> {
    const token = getToken(req, res);

    try {
        const { accountId, webhookUrl, webhookSecret } = req.body;
        if (!(typeof accountId === "string")) {
            res.status(400).json({ error: "Invalid request body" });
            return;
        }
        const response: AxiosResponse<{ address: string }> = await axios.post(`${IBEXEnum.BASE_URL}onchain/address`, { accountId, webhookUrl, webhookSecret }, {
            headers: { Authorization: token },
        });
        await insertAddress(accountId, response.data.address);
        res.status(201).json({ message: 'Address created successfully', data: response.data.address });
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}
async function estimateFee(token: string | undefined, address: string, amount: number) {
    try {
        const response: AxiosResponse<{ feeSat: number }> = await axios.get(`${IBEXEnum.BASE_URL}v2/onchain/estimate-fee`, {
            headers: { Authorization: token },
            params: { address, amount }
        });
        return response.data.feeSat;
    } catch (error) {
        throw error;
    }
}

async function estimateFeeHandler(req: Request, res: Response): Promise<void> {
    const token = getToken(req, res);

    try {
        const { address, amount } = req.query;
        if (!(typeof address === 'string' && amount)) {
            res.status(400).json({ error: "Invalid request body" });
            return;
        }
        const feeSat = await estimateFee(token, address, +amount);
        res.status(200).json({ data: feeSat });
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}

async function sendStatsToBitcoinHandler(req: Request, res: Response): Promise<void> {
    const token = getToken(req, res);

    try {
        const { accountId, address, amount, webhookUrl, webhookSecret } = req.body;
        if (!(typeof accountId === "string" && typeof address === 'string' && typeof amount === 'number')) {
            res.status(400).json({ error: "Invalid request body" });
            return;
        }
        const feeSat = await estimateFee(token, address, amount);
        const response: AxiosResponse<IbexOnchainTransaction> = await axios.post(`${IBEXEnum.BASE_URL}v2/onchain/send`, { accountId, address, amount, feeSat, webhookUrl, webhookSecret }, {
            headers: { Authorization: token },
        });

        await insertTransaction(accountId, address, response.data)

        res.status(200).json({ data: response.data });

    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}


async function getTransactionDetails(req: Request, res: Response): Promise<void> {
    const token = getToken(req, res);

    try {
        const { transactionId } = req.params;
        const response: AxiosResponse<IbexOnchainTransaction> = await axios.get(`${IBEXEnum.BASE_URL}onchain/tx/${transactionId}`, {
            headers: { Authorization: token },
        });
        res.status(200).json({ data: response.data });
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }

}

async function receiveFundsWebhookHandler(req: Request, res: Response): Promise<void> {
    const token = getToken(req, res);
    try {
        const { webhookSecret, ...body }: IbexOnchainTransactionWebhookPayload = req.body;
        if (webhookSecret == process.env.WEBHOOK_SECRET) {

            res.status(200).send({"msg": "Transaction Successful"})

        } else {
            res.status(401).send({ error: 'Invalid Secret' });
        }
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}

export { createBitcoinAddressHandler, estimateFeeHandler, sendStatsToBitcoinHandler, getTransactionDetails, receiveFundsWebhookHandler }

