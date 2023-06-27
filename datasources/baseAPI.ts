/* eslint-disable @typescript-eslint/no-explicit-any */
import { RESTDataSource } from "apollo-datasource-rest"
import { Redis } from "ioredis"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import api from "api"

const getAuthTokenFromRedis = async (redis: Redis): Promise<string | null> => {
  const authToken = await redis.get("authToken:ibexMain")
  return authToken
}

const refreshAuthToken = async (redis: Redis): Promise<string> => {
  const refreshToken = await redis.get("refreshToken:ibexMain")
  if (refreshToken) {
    // Dynamically import AuthenticationAPI here
    const { default: AuthenticationAPI } = await import("./authenticationAPI")
    const authenticationAPI = new AuthenticationAPI(redis)
    const data = await authenticationAPI.refreshAuthToken(refreshToken)
    return data.accessToken
  }
  throw new Error("No refresh token found")
  // TODO: Handle the case where the refresh token has expired. Log the user out and redirect them to the login page.
}

export default class BaseAPI extends RESTDataSource {
  protected sdk: any = api("@sing-in/v1.0#7ke20q2yclgl65aqb")
  authToken: string | null = null
  private redis?: Redis

  constructor(redis?: Redis) {
    super()
    if (redis) {
      this.redis = redis
      this.initialize()
    }
  }

  async initialize() {
    if (this.redis) {
      this.authToken = await getAuthTokenFromRedis(this.redis)
    }
  }

  willSendRequest(request) {
    if (this.authToken) {
      request.headers.set("Authorization", `Bearer ${this.authToken}`)
    }
  }

  async makeRequest(
    requestFunction: () => Promise<{ data: any }>,
  ): Promise<{ data: any }> {
    try {
      return await requestFunction()
    } catch (err) {
      if (err.status === 401) {
        if (this.redis) {
          this.authToken = await refreshAuthToken(this.redis)
          return requestFunction()
        }
      } else {
        throw err
      }
    }
    return { data: undefined }
  }
}
