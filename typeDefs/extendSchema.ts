import { extendSchema, parse } from "graphql"
import { isAuthenticated } from "@servers/graphql-server"
import { applyMiddleware } from "graphql-middleware"
import { shield } from "graphql-shield"
import { Rule } from "graphql-shield/typings/rules"

import { gqlMainSchema } from "../../../graphql/main"

const extensionSDL = `
extend type Query {
    externalWalletById(accountId: ID!): ExternalWallet
}

extend type Mutation {
    createExternalWallet(username: String!, currencyId: Int!): ExternalWallet
    getExternalWalletToken(credentials: ExternalWalletCredentials!): ExternalWalletSignInResponse!
    refreshExternalWalletToken(refreshToken: String!): ExternalWalletSignInResponse!
}

type ExternalWalletCredentials {
    email: String!
    password: String!
}

type ExternalWalletSignInResponse {
    accessToken: String!
    accessTokenExpiresAt: Int!
    refreshToken: String!
    refreshTokenExpiresAt: Int!
  }
  
type ExternalWallet implements Wallet {
    accountId: ID!
    externalUserId: ID!
    balance: SignedAmount!
    id: ID!
    externalId: ID!

    """
    An unconfirmed incoming onchain balance.
    """
    pendingIncomingBalance: SignedAmount!
    transactions(
        """
        Returns the items in the list that come after the specified cursor.
        """
        after: String

        """
        Returns the items in the list that come before the specified cursor.
        """
        before: String

        """
        Returns the first n items from the list.
        """
        first: Int

        """
        Returns the last n items from the list.
        """
        last: Int
    ): TransactionConnection
    transactionsByAddress(
        """
        Returns the items that include this address.
        """
        address: OnChainAddress!

        """
        Returns the items in the list that come after the specified cursor.
        """
        after: String

        """
        Returns the items in the list that come before the specified cursor.
        """
        before: String

        """
        Returns the first n items from the list.
        """
        first: Int

        """
        Returns the last n items from the list.
        """
        last: Int
    ): TransactionConnection
    walletCurrency: WalletCurrency!
`

const extendedSchema = extendSchema(gqlMainSchema, parse(extensionSDL))
const permissions = shield({
  Query: {
    myQuery: isAuthenticated,
  },
})

// Apply middleware and permissions to the merged schema
const schema = applyMiddleware(extendedSchema, permissions)

export default schema
