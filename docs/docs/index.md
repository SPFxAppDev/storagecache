# @spfxappdev/storage

![npm](https://img.shields.io/npm/v/@spfxappdev/storage) ![npm bundle size](https://img.shields.io/bundlephobia/min/@spfxappdev/storage) ![npm](https://img.shields.io/npm/dm/@spfxappdev/storage)

`@spfxappdev/storage` is a library to handle the javascript `localStorage` and `sessionStorage` in a simple way. It comes with a built-in expiration logic (per default `60 minutes`).
It is possible to delete the entire storage or only a specific one via URL parameters. The included decorators simplify the application and keep the code short and simple, because you only have to implement the logic (of your method) itself and not the caching (see [decorators section](#decorators)).

## Installation

`npm i @spfxappdev/storage`

## Usage

Depending on which type of caching you want to use ([localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) or [sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)) you must first import the class(es).
But regardless of the type, the logic and handling is the same for both classes.

### 1. import the storage class(es) into your project

```typescript
import { LocalStorage, SessionStorage } from '@spfxappdev/storage';
```
___

### 2. You can create an instance now.

```typescript
const sessionCache = new SessionStorage();
const localCache = new LocalStorage();
```
___

### 3. Set/Get Data

```typescript title="Set/Get Data Example"
sessionCache.set("mySessionStorageKey", "mySessionStorageValue");
let dataFromCache = sessionCache.get("mySessionStorageKey");
console.log(dataFromCache); //RESULT: mySessionStorageValue

const myObj = {
    name: '@spfxappdev/storage',
    install: 'npm i @spfxappdev/storage',
    author: 'SPFxAppDev'
};

localCache.set("myLocalStorageKey", myObj);
console.log(myObj); //RESULT: (1)
```

1. `{    name: '@spfxappdev/storage',
    install: 'npm i @spfxappdev/storage',
    author: 'SPFxAppDev'
}
`

___

### 4. Get data or set data with callback function if not available

```typescript
let dataFromCache = localCache.get("myLocalStorageKey", () => {
    //Note: (1) 
    return {
        name: '@spfxappdev/storage',
        install: 'npm i @spfxappdev/storage',
        author: 'SPFxAppDev'
    }; 
});
```

1. If the storage key does not exist or the cache has expired, the `callback` function is executed. The return value of this `callback` function is used to store the `value` in the cache with the specified `key`.

___

## API

TBD