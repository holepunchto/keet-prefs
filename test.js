/* global Pear */
'use strict'
const path = require('path')
const fs = require('fs')
const test = require('brittle')

fs.rmSync('./pear', { recursive: true, force: true })

test('preferences get from app dir', async (t) => {
  t.teardown(() => {
    fs.rmSync('./pear', { recursive: true, force: true })
    delete require.cache[require.resolve('.')]
  })
  fs.mkdirSync('./pear/tmp/app-storage', { recursive: true })
  global.Pear = {
    config: {
      pearDir: './pear',
      storage: './pear/tmp/app-storage'
    }
  }
  const preferences = require('.')
  await preferences.set('a', 'key')
  t.alike(JSON.parse(fs.readFileSync(path.join(Pear.config.storage, 'preferences.json'))), { a: 'key' })
})

test('keet migrate prefs', async (t) => {
  t.teardown(() => {
    fs.rmSync('./pear', { recursive: true, force: true })
    delete require.cache[require.resolve('.')]
  })
  fs.mkdirSync('./pear/tmp/app-storage', { recursive: true })
  fs.writeFileSync('./pear/preferences.json', '{"some":"json"}')

  global.Pear = {
    config: {
      pearDir: './pear',
      storage: './pear/tmp/app-storage',
      key: { z32: 'oeeoz3w6fjjt7bym3ndpa6hhicm8f8naxyk11z4iypeoupn6jzpo' }
    }
  }

  const preferences = require('.')
  await preferences.set('a', 'key')

  t.alike(JSON.parse(fs.readFileSync(path.join(Pear.config.storage, 'preferences.json'))), { a: 'key', some: 'json' })
})
