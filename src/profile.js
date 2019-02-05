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
  static _headers (params) {
    return {
      authorization: `Bearer ${params.token}`,
      'content-type': 'application/json'
    }
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
            headers: HttpProfileResource._headers({ token })
          }
        )
      )
  }
  listProfiles (ids, scope) {
    let qs = `?ids=${ids.join(',')}&scope=${scope}`

    return this.tokenProvider.getToken()
      .then((token) =>
        this.httpClient.get(
          `${this.baseUrl}/users${qs}`,
          {
            headers: HttpProfileResource._headers({ token })
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
            headers: HttpProfileResource._headers({ token })
          }
        )
      )
  }
}
