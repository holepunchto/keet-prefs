# keet-prefs

Keet Preferences library

```
npm install keet-prefs
```

## API

Atomic single-JSON-file-backed key-value store.

```js
import prefs from 'keet-prefs'
```

> Automigrates Production Keet `preferences.json` to keet-prefs app-storage based `preferences.json`.

### `await prefs.get(key)`

Gets a value by key

### `await prefs.set(key, value)`

Sets a value by key

### `await prefs.clear(key, value)`

Clears all keys

### LICENSE

Apache-2.0