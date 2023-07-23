import { getToken } from '@ibex/app/helper';
import { IBEXEnum } from '@ibex/domain';
import axios, { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { IBEXLightningAddressData, IBEXLightningAddressPutBody, createLightningAddress, deleteLightningAddress, getLightningAddressesByAccountById, updateLightningAddress } from '@ibex/app/model/lightningaddress';



async function createLightningAddressHandler(req: Request, res: Response): Promise<void> {
    try {
        const token = getToken(req, res);
        // Check if the request body conforms to the expected structure
        const { username, accountId } = req.body;
        if (!(typeof username === "string" && typeof accountId === "string")) {
            res.status(400).json({ error: "Invalid request body" });
            return;
        }
        const response: AxiosResponse<IBEXLightningAddressData> = await axios.post(`${IBEXEnum.BASE_URL}lightning-address`, { username, accountId }, {
            headers: { Authorization: token },
        });
        await createLightningAddress(response.data);
        res.status(201).json({ message: 'Lightning address created successfully', data: response.data });
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}

async function getLightningAddressesByAccountIdHandler(req: Request, res: Response): Promise<void> {
    try {
        const { addressId } = req.params;
        const lightningAddress = await getLightningAddressesByAccountById(addressId);
        if (!lightningAddress) {
            res.status(404).json({ message: 'Address not found' });
        } else {
            res.status(200).json({ lightningAddress });
        }
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}

async function updateLightningAddressHandler(req: Request, res: Response): Promise<void> {
    try {
        const token = getToken(req, res);
        const { addressId } = req.params;
        const requestBody: IBEXLightningAddressPutBody = req.body;
        if (!(typeof requestBody.username === "string")) {
            res.status(400).json({ error: "Invalid request body" });
            return;
        }
        const response = await axios.put(`${IBEXEnum.BASE_URL}lightning-address/${addressId}`, requestBody, {
            headers: { Authorization: token },
        });
        if (!response) {
            res.status(404).json({ message: 'Address not found' });
        } else {
            await updateLightningAddress(addressId, requestBody);
            res.status(200).json({ message: 'Account updated successfully' });
        }
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}

async function deleteLightningAddressHandler(req: Request, res: Response): Promise<void> {
    try {
        const token = getToken(req, res);
        const { addressId } = req.params;
        await axios.delete(`${IBEXEnum.BASE_URL}lightning-address/${addressId}`, {
            headers: { Authorization: token },
        });
        await deleteLightningAddress(addressId);
        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error: any) {
        res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    }
}

export { createLightningAddressHandler, getLightningAddressesByAccountIdHandler, updateLightningAddressHandler, deleteLightningAddressHandler };
