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
  async getProfile (id, scope) {
    const token = await this.tokenProvider.getToken()
    let qs = ''

    if (scope) {
      qs = `?scope=${scope}`
    }

    return this.httpClient.get(
      `${this.baseUrl}/users/${id}${qs}`,
      {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json'
      }
    )
  }
  async updateAttributes (id, scope, data) {
    const token = await this.tokenProvider.getToken()
    let qs = `?scope=${scope}`

    return this.httpClient.patch(
      `${this.baseUrl}/users/${id}${qs}`,
      {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json'
      },
      data
    )
  }
}
