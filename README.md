# ProfileJS
JavaScript API-client for Profile service

## Installation

```sh
npm install --save @ulms/profile
```

## Example

```js
import {
  FetchHttpClient,
  SimpleTokenProvider,
  HttpProfileResource
} from '@ulms/profile'

const TOKEN = 'jwt-token'
const id = '123'
const scope = '456'

const profile = new HttpProfileResource(
  'https://example.com',
  'api/v1/profile',
  new FetchHttpClient(),
  new SimpleTokenProvider(TOKEN)
)

// retrieving profile data
profile.getProfile(id, scope)
  .then((response) => {
    console.log('[response]', response)
  })
  .catch((error) => {
    console.log('[error]', error)
  })
  
// updating some attributes
profile.updateAttributes(id, scope, {role: 'user'})
  .then((response) => {
    console.log('[response]', response)
  })
  .catch((error) => {
    console.log('[error]', error)
  })
```
