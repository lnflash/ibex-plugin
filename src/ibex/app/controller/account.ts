import { getToken } from '@ibex/app/helper';
import { IBEXAccountData, IBEXAccountRequestPutBody, createAccount, getAccountById, listAccounts, updateAccount } from '@ibex/app/model/account';
import { IBEXEnum } from '@ibex/domain';
import axios, { AxiosResponse } from 'axios';
import { Request, Response } from 'express';



async function createAccountHandler(req: Request, res: Response): Promise<void> {
    try {
        const token = getToken(req, res);
        // Check if the request body conforms to the expected structure
        const { name, currencyId } = req.body;
        if (!(typeof name === "string" && typeof currencyId === "number")) {
            res.status(400).json({ error: "Invalid request body" });
            return;
        }
        const response: AxiosResponse<IBEXAccountData> = await axios.post(`${IBEXEnum.BASE_URL}account/create`, { name, currencyId }, {
            headers: { Authorization: token },
        });
        await createAccount(response.data);
        res.status(201).json({ message: 'Account created successfully', data: response.data });
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}

async function getAccountByIdHandler(req: Request, res: Response): Promise<void> {
    try {
        const { accountId } = req.params;
        const account = await getAccountById(accountId);
        if (!account) {
            res.status(404).json({ message: 'Account not found' });
        } else {
            res.status(200).json({ account });
        }
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}

async function updateAccountHandler(req: Request, res: Response): Promise<void> {
    try {
        const token = getToken(req, res);
        const { accountId } = req.params;
        const requestBody: IBEXAccountRequestPutBody = req.body;
        if (!(typeof requestBody.name === "string")) {
            res.status(400).json({ error: "Invalid request body" });
            return;
        }
        const response =  await axios.put(`${IBEXEnum.BASE_URL}account/${accountId}`, requestBody, {
            headers: { Authorization: token },
        });
        if (!response) {
            res.status(404).json({ message: 'Account not found' });
        } else {
            await updateAccount(accountId, requestBody);
            res.status(200).json({ message: 'Account updated successfully' });
        }
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}

async function listAccountsHandler(req: Request, res: Response): Promise<void> {
    try {
        const accounts = await listAccounts();
        res.status(200).json({ accounts });
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}

export { createAccountHandler, getAccountByIdHandler, updateAccountHandler, listAccountsHandler };
