import { IBEXEnum } from "@ibex/domain";
import axios, { AxiosResponse } from "axios";
import { getToken } from "@ibex/app/helper";
import { Request, Response } from "express";
import { IBEXCurrency } from "@ibex/app/model/currency";

async function getCurrencyHandler(req: Request, res: Response): Promise<void> {
  const token = getToken(req, res);
  try {
    const response: AxiosResponse<IBEXCurrency> = await axios.get(`${IBEXEnum.BASE_URL}currency/all`, {
      headers: { Authorization: token },
    });
    res.status(200).json({
      data: response.data.currencies
        .filter((o) => o.accountEnabled)
        .map((o) => {
          return { id: o.id, name: o.name, symbol: o.symbol, isFiat: o.isFiat };
        }),
    });
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ error: error.response?.data?.error || "Internal Server Error" });
    console.log(error);
  }
}

export { getCurrencyHandler };
