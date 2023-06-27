import { Redis } from "ioredis"

import BaseAPI from "./baseAPI"

const redis = new Redis()

// Define the response shape
interface ExternalWalletSignInResponse {
  accessToken: string
  accessTokenExpiresAt: number
  refreshToken: string
  refreshTokenExpiresAt: number
}

class AuthenticationAPI extends BaseAPI {
  async getAuthToken(
    email: string,
    password: string,
  ): Promise<ExternalWalletSignInResponse> {
    try {
      const { data }: { data: ExternalWalletSignInResponse } = await this.sdk.signIn({
        email,
        password,
      })
      // Store auth token
      await redis.set(
        `authToken:ibexMain`,
        data.accessToken,
        "EX",
        data.accessTokenExpiresAt,
      )
      await redis.set(
        `refreshToken:ibexMain`,
        data.refreshToken,
        "EX",
        data.refreshTokenExpiresAt,
      )

      return data
    } catch (err) {
      console.error(err)
      throw err // re-throw the error so it can be caught and handled by GraphQL
    }
  }

  async refreshAuthToken(refreshToken: string): Promise<ExternalWalletSignInResponse> {
    try {
      const { data }: { data: ExternalWalletSignInResponse } =
        await this.sdk.refreshAccessToken({
          refreshToken,
        })
      // Store auth token
      await redis.set(
        `authToken:ibexMain`,
        data.accessToken,
        "EX",
        data.accessTokenExpiresAt,
      )
      await redis.set(
        `refreshToken:ibexMain`,
        data.refreshToken,
        "EX",
        data.refreshTokenExpiresAt,
      )

      return data
    } catch (err) {
      console.error(err)
      throw err // re-throw the error so it can be caught and handled by GraphQL
    }
  }

  getSignInAuth(email: string, password: string) {
    return this.getAuthToken(email, password)
  }
}

export default AuthenticationAPI
