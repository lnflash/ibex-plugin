const AuthenticationResolvers = {
  Mutation: {
    getExternalWalletToken: async (_, { credentials }, { dataSources }) => {
      return dataSources.authenticationAPI.getAuthToken(
        credentials.email,
        credentials.password,
      )
    },
    refreshExternalWalletToken: async (_, { refreshToken }, { dataSources }) => {
      return dataSources.authenticationAPI.refreshAuthToken(refreshToken)
    },
  },
}

export default AuthenticationResolvers
