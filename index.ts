import { ApolloServer } from "apollo-server-express"

import { redis } from "../redis" // Import the redis instance from the main project

import typeDefs from "./typeDefs"
import resolvers from "./resolvers"
import { AuthenticationAPI, UserAPI, BaseAPI } from "./datasources"

const authenticationAPI = new AuthenticationAPI(redis)
const userAPI = new UserAPI()
const baseAPI = new BaseAPI(redis) // Pass the Redis instance

const ibexServer = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    authenticationAPI,
    userAPI,
    baseAPI,
  }),
})

export default ibexServer
