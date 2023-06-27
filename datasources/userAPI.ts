/* eslint-disable @typescript-eslint/no-explicit-any */
import ExternalWallet from "../models/externalWallet"

import BaseAPI from "./baseAPI"

// Define the response shapes

interface CreateAccountResponse {
  id: string
  userId: string
  name: string
  currencyId: number
}

interface GetAccountDetailsResponse {
  id: string
  userId: string
  name: string
  balance: number
}

class UserAPI extends BaseAPI {
  async createAccount(
    username: string,
    currencyId: number,
  ): Promise<CreateAccountResponse> {
    try {
      const { data }: { data: CreateAccountResponse } = await this.makeRequest(() =>
        this.sdk.createAccount({
          username,
          currencyId,
        }),
      )
      // Create a new ExternalWallet document in MongoDB
      await ExternalWallet.create({
        accountId: data.id,
        externalUserId: data.userId,
      })

      return data
    } catch (err) {
      console.error(err)
      throw err // re-throw the error so it can be caught and handled by GraphQL
    }
  }

  async getAccountDetails(accountId: string): Promise<GetAccountDetailsResponse> {
    try {
      const { data }: { data: GetAccountDetailsResponse } = await this.makeRequest(() =>
        this.sdk.getAccountDetails({ accountId }),
      )
      return data
    } catch (err) {
      console.error(err)
      throw err // re-throw the error so it can be caught and handled by GraphQL
    }
  }
}

export default UserAPI
