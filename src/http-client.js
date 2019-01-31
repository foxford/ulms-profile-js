/* global fetch */

export class FetchHttpClient {
  get (url, config) {
    return fetch(url, {
      method: 'GET',
      headers: config.headers
    })
      .then((response) => response.json())
  }
  patch (url, data, config) {
    return fetch(url, {
      method: 'PATCH',
      headers: config.headers,
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
  }
}
