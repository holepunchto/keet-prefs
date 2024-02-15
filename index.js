/* global Pear */
'use strict'
const fs = require('fs')
const path = require('path')
const { writeFile, rename } = require('fs/promises')
const mutexify = require('mutexify/promise')
const Iambus = require('iambus')

const PLATFORM_DIR = Pear.config.pearDir
const PREFERENCES = path.join(Pear.config.storage, 'preferences.json')
const NEXT = path.join(Pear.config.storage, 'preferences.next.json')

if (Pear.config.key?.z32 === 'oeeoz3w6fjjt7bym3ndpa6hhicm8f8naxyk11z4iypeoupn6jzpo') {
  if (fs.existsSync(PREFERENCES) === false) {
    const next = path.join(PLATFORM_DIR, 'preferences.next.json')
    fs.writeFileSync(next, fs.readFileSync(path.join(PLATFORM_DIR, 'preferences.json')))
    fs.renameSync(next, PREFERENCES)
  }
}

let settings = {}
try { settings = JSON.parse(fs.readFileSync(PREFERENCES)) } catch {}

// singleton:
module.exports = new class Preferences {
  #mutexify = null
  #writes = 0
  bus = new Iambus()
  constructor () {
    this.#mutexify = mutexify()
  }

  async set (key, value) {
    settings[key] = value
    this.#update(['set', key, value])
    await this.#flush()
    return true
  }

  async #flush () {
    this.#writes++

    const release = await this.#mutexify()

    if (!this.#writes) {
      release()
      return
    }

    try {
      const writes = this.#writes

      await writeFile(NEXT, JSON.stringify(settings))
      await rename(NEXT, PREFERENCES)

      this.#writes -= writes
    } catch (err) {
      console.error(err)
    } finally {
      release()
    }
  }

  async get (key) {
    return settings[key]
  }

  async clear () {
    settings = {}
    this.#update(['clear'])
    await this.#flush()
    return true
  }

  #update (data) { return this.bus.pub({ topic: 'update', data }) }

  updates () { return this.bus.sub({ topic: 'update' }) }

  entries () { return Object.entries(settings) }
}()
