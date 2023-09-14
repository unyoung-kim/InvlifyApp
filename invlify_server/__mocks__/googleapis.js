class OAuth2 {
  constructor() {}

  setCredentials() {}

  getAccessToken() {
    return { token: '123' }
  }
}

module.exports = {
  google: {
    auth: {
      OAuth2,
    },
  },
}
