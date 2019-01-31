export class HttpProfileResource {
  constructor (
    host,
    endpoint,
    httpClient,
    tokenProvider
  ) {
    this.baseUrl = `${host}/${endpoint}`
    this.httpClient = httpClient
    this.tokenProvider = tokenProvider
  }
  getProfile (id, scope) {
    let qs = ''

    if (scope) {
      qs = `?scope=${scope}`
    }

    return this.tokenProvider.getToken()
      .then((token) =>
        this.httpClient.get(
          `${this.baseUrl}/users/${id}${qs}`,
          {
            headers: {
              authorization: `Bearer ${token}`,
              'content-type': 'application/json'
            }
          }
        )
      )
  }
  updateAttributes (id, scope, data) {
    let qs = `?scope=${scope}`

    return this.tokenProvider.getToken()
      .then((token) =>
        this.httpClient.patch(
          `${this.baseUrl}/users/${id}${qs}`,
          data,
          {
            headers: {
              authorization: `Bearer ${token}`,
              'content-type': 'application/json'
            }
          }
        )
      )
  }
}
