import ExternalWallet from "../models/externalWallet"

const UserResolvers = {
  Query: {
    externalWalletById: async (_, { accountId }) => {
      return ExternalWallet.findOne({ accountId })
    },
  },
  Mutation: {
    createExternalWallet: async (_, { username, currencyId }, { dataSources }) => {
      return dataSources.userAPI.createAccount(username, currencyId)
    },
  },
  ExternalWallet: {
    accountId: (externalWallet) => externalWallet.accountId,
    externalUserId: (externalWallet) => externalWallet.externalUserId,
    balance: async (externalWallet, _, { dataSources }) => {
      const details = await dataSources.userAPI.getAccountDetails(
        externalWallet.externalUserId,
      )
      return details.balance
    },
    id: (externalWallet) => externalWallet.id,
    externalId: async (externalWallet, _, { dataSources }) => {
      const details = await dataSources.userAPI.getAccountDetails(
        externalWallet.externalUserId,
      )
      return details.id
    },
  },
}

export default UserResolvers
