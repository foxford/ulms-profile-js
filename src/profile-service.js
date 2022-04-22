import PQueue from 'p-queue/dist/index'
import chunk from 'lodash/chunk'
import throttle from 'lodash/throttle'

class ProfileService {
  constructor (client, options = {}) {
    const { chunkLimit = 35, concurrency = 1, interval = 1000, intervalCap = 2 } = options

    this._client = client
    this._chunkLimit = chunkLimit
    this._profileMap = {}
    this._queue = new PQueue({ concurrency, interval, intervalCap })
    this._throttledPerformFetch = throttle(this._performFetch.bind(this), 200, { leading: false })
  }

  _performFetch () {
    const keys = Object.keys(this._profileMap).filter(_ => this._profileMap[_].state === 'new')
    const keyChunks = chunk(keys, this._chunkLimit)

    if (!keyChunks.length) return

    keyChunks.forEach((chunk) => {
      const [, scope] = chunk[0].split(':')
      const ids = chunk.map(_ => _.split(':')[0])

      chunk.forEach((key) => {
        this._profileMap[key].state = 'pending'
      })

      this._queue.add(() => this._client.listProfiles(ids, scope)
        .then((response) => {
          response.forEach((profile) => {
            const { id } = profile

            this._resolve(`${id}:${scope}`, profile)
          })
        })
        .catch((error) => {
          chunk.forEach(key => this._reject(key, error))
        }))
    })
  }

  _resolve (key, data) {
    const { resolve } = this._profileMap[key]

    this._profileMap[key].data = data
    this._profileMap[key].state = 'fulfilled'

    delete this._profileMap[key].promise
    delete this._profileMap[key].resolve
    delete this._profileMap[key].reject

    resolve(this._profileMap[key].data)
  }

  _reject (key, error) {
    const { reject } = this._profileMap[key]

    delete this._profileMap[key]

    reject(error)
  }

  forceReadProfile (id, scope) {
    return this._client.getProfile(id, scope, true)
  }

  readMeProfile (scope) {
    return this._client.getProfile('me', scope)
  }

  readProfile (id, scope) {
    const key = `${id}:${scope}`
    const profile = this._profileMap[key]

    // already has profile in map
    if (profile) {
      const { data, promise, state } = profile

      if (state === 'new' || state === 'pending') {
        return promise
      }

      if (state === 'fulfilled') {
        return Promise.resolve(data)
      }
    }

    // new profile
    let promiseFnMap = {}
    const promise = new Promise((resolve, reject) => {
      promiseFnMap = {
        resolve,
        reject
      }
    })

    this._profileMap[key] = {
      ...promiseFnMap,
      data: null,
      promise,
      state: 'new'
    }

    this._throttledPerformFetch()

    return promise
  }
}

export { ProfileService }
