/* global fetch */

export class FetchHttpClient {
  get (url, headers) {
    return fetch(url, {
      method: 'GET',
      headers: headers
    })
      .then((response) => response.json())
  }
  patch (url, headers, data) {
    return fetch(url, {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify(data)
    })
      .then((response) => response.json())
  }
}
