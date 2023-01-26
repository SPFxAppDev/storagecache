# @spfxappdev/storage
___

![npm](https://img.shields.io/npm/v/@spfxappdev/storage) ![npm bundle size](https://img.shields.io/bundlephobia/min/@spfxappdev/storage) ![npm](https://img.shields.io/npm/dm/@spfxappdev/storage)

`@spfxappdev/storage` is a library to handle the javascript `localStorage` and `sessionStorage` in a simple way. It comes with a built-in expiration logic (per default `60 minutes`).
It is possible to delete the entire storage or only a specific one via URL parameters. The included decorators simplify the application and keep the code short and simple, because you only have to implement the logic (of your method) itself and not the caching (see [decorators section](#decorators)).  [The "nicer" and more user-friendly documentation can be found here](https://spfxappdev.github.io/storagecache)

## Installation
___

`npm i @spfxappdev/storage`

## Usage
___
Depending on which type of caching you want to use ([localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) or [sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)) you must first import the class(es).
But regardless of the type, the logic and handling is the same for both classes.

### 1. Import the storage class(es) into your project
___

```typescript
import { LocalStorage, SessionStorage } from '@spfxappdev/storage';
```

### 2. You can create an instance now.
___

```typescript
const sessionCache = new SessionStorage();
const localCache = new LocalStorage();
```

### 3. Set/Get Data
___

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
console.log(myObj); //RESULT: { name: '@spfxappdev/storage', install: 'npm i @spfxappdev/storage', author: 'SPFxAppDev' }
```


### 4. Get data or set data with callback function if not available
___

```typescript
let dataFromCache = localCache.get("myLocalStorageKey", () => {
    //Note: If the storage key does not exist or the cache has expired, the `callback` function is executed. 
    //The return value of this `callback` function is used to store the `value` in the cache with the specified `key`. 
    return {
        name: '@spfxappdev/storage',
        install: 'npm i @spfxappdev/storage',
        author: 'SPFxAppDev'
    }; 
});
```


### 5. Custom settings
___

The constructor of both classes `LocalStorage` and `SessionStorage` can be given additional configuration options.

#### Options (`IStorageSettings`)

| Name                                  | Type                                    | Required | Description                        |  Default Value                        |
|---------------------------------------|-----------------------------------------|----------|------------------------------------|---------------------------------------|
| `UrlParameter`                        | `IStorageUrlParameters`                 | Yes      | Settings for clearing cache via URL parameters. See the section [Clear storage via URL parameters](#clear-storage-via-url-parameters) | `{ RefreshAll: 'ResetCache', RefreshOnly: 'ResetOnly' }` |
| `DefaultTimeToLife`                   | `number`                                | Yes      | The `timeToLife` option determines when the cache should expire (in minutes). | `60` |
| `KeyPrefix`                           | `string`                                | Yes      | The prefix that is inserted before the `cacheKey` | `SPFxAppDev_` |


#### Options (`IStorageUrlParameters`)

| Name          | Type     | Required | Description                        |
|---------------|----------|----------|------------------------------------|
| `RefreshAll`  | `string` | Yes      | The name of the URL parameter that should clear all stored values from the cache |
| `RefreshOnly` | `string` | Yes      | The name of the URL parameter that should clear one or more specified keys from the cache |

#### Override default settings per instance
___

If you want to override the default settings per instance, you can do it like this:

```typescript title="Override default settings per instance"
const sessionCache = new SessionStorage({
    UrlParameter: {
        RefreshAll: 'ResetCacheSession',
        RefreshOnly: 'ResetSessionOnly'
    },
    DefaultTimeToLife: 30,
    KeyPrefix: 'SPFxAppDevSession_'
});

const localCache = new LocalStorage({
    UrlParameter: {
        RefreshAll: 'ResetCacheLocal',
        RefreshOnly: 'ResetLocalOnly'
    },
    DefaultTimeToLife: 120,
    KeyPrefix: LocalStorage.DefaultSettings.KeyPrefix // Use the default value of `LocalStorage` if you do not want to overwrite it
});
```

#### Override default settings globally
___

If you want to override the default settings, you can do it like this:

```typescript title="Override default settings globally"
const defaultLocalStorageSettingsOverride: IStorageSettings  = {
    UrlParameter: {
        RefreshAll: 'ResetCacheLocal',
        RefreshOnly: 'ResetLocalOnly'
    },
    DefaultTimeToLife: 120,
    KeyPrefix: 'SPFxAppDevLocal_'
};

LocalStorage.DefaultSettings = defaultLocalStorageSettingsOverride;

// Use the spread operator to override only some options
const defaultSessionStorageSettingsOverride: IStorageSettings = {...SessionStorage.DefaultSettings, ...{ 
    KeyPrefix: "SPFxAppDevSession_", 
    DefaultTimeToLife: 5,
}};

SessionStorage.DefaultSettings = defaultSessionStorageSettingsOverride;
```


> **INFO**: This only works if the settings were overwritten first and then the instances were created. Also, you then have to make sure that the overwritten code is imported everywhere (e.g. in the `boot` file).

## API
___

The methods are the same regardless of the type of caching (`local` or `session`) you use.

### `constructor`
___

> `constructor(customSettings?: IStorageSettings)`

When you create a new object instance, you can pass the `optional` parameter `customSettings`. See [the usage section](#usage) on how to create a new instance or the [custom settings section](#5-custom-settings) to pass your custom settings options.

### `set`
___

> `set(cacheKey: string, cacheValue: any, timeToLife: number = 60)`

This method stores the passed `cacheValue` with the given `cacheKey` in the `localStorage` or `sessionStorage` container. The `timeToLife` argument is optional (default = 60 minutes) and determines when the cache should expire (in minutes). If a value with the `cacheKey` already exists, it will be overwritten with the new `cacheValue`.

After the value has been set, two keys exist in the respective storage. The second one has the suffix `_expire` which contains the timestamp as a value when the cache expires.


For example, if you store a value in `sessionStorage` in this way:

```typescript
sessionCache.set("mySessionStorageKey", "mySessionStorageValue");
```

The storage will then looks like this:

| Key                                   | Value                        |
|---------------------------------------|------------------------------|
| SPFxAppDev_mySessionStorageKey        | mySessionStorageValue        |
| SPFxAppDev_mySessionStorageKey_expire | 1674594394115                |


> **INFO**: You can change the prefix as described in the [custom settings section](#5-custom-settings)

 

> **WARNING**: When objects are stored in the storage, they are serialized via `JSON.stringify()`. This means that all `methods` and `properties` that only have a `getter` will not be stored. In reverse it means that in `storage.get()` these `methods` and `getter` properties are also not present. 



### `get`
___

> `get(cacheKey: string, delegateFunction: Function|null = null, timeToLife: number = 60)`

This method returns the stored value of the specified `cacheKey`. The `cacheKey` corresponds to the same value as specified in the [set method](#set). If the `cacheKey` does not exist, or the key with the suffix `_expired` does not exist, or the cache has expired AND the `delegateFunction` is passed, then this function is executed and the return value of this function is used to store the value in the specified `cacheKey`. If the `delegateFunction` is not passed and the `cacheKey` does not exist, or the key with the suffix `_expired` does not exist, or the cache has expired, `null` is returned. The `timeToLife` (in minutes) argument is also optional and is used if `delegateFunction` is passed AND the cache value is (re)set.

> **INFO**: Each `cacheKey` is stored with a `KeyPrefix`. If different instances exist that have different `KeyPrefix` values, only the value that has exactly this `KeyPrefix` is returned. That means if there is an instance that uses `one` as `KeyPrefix` and another that uses `two` as `KeyPrefix`, when the `set` method is executed with the same `cacheKey` (e.g. `test`), two different "storage" keys will be created. So the keys `one_test` and `two_test` exist. The `get("test")` method then returns only the value corresponding to the `{KeyPrefixOfCurrentInstance}_{cacheKey}`. => `instanceWithPrefixOne.get('test') //RETURNS 'test with keyPrefix "one"` and `instanceWithPrefixTwo.get('test') //RETURNS 'test with keyPrefix "two"`

> **WARNING**: When objects are stored in the storage, they are serialized via `JSON.stringify()`. This means that all methods and `properties` that only have a `getter` will not be stored. In reverse it means that in `storage.get()` these methods and `getter` properties are also not present.

### `remove`
___

> `remove(cacheKey: string)`

Removes the cached value from storage with the specified `cacheKey`. The `cacheKey` corresponds to the same value as specified in the [set method](#set).

> **INFO**: Each `cacheKey` is stored with a `KeyPrefix`. If different instances exist that have different `KeyPrefix` values, only the value that has exactly this `KeyPrefix` is removed. 

### `clear`
___

> `clear()`

Removes any cached value from storage. But only the values that start with the `KeyPrefix` (=were set with this instance).

### `exists`
___

> `exists(cacheKey: string)`

Checks if an item exist in storage cache with specified `cacheKey`.

> **WARNING**: this is the generell `getItem`-Methode of the cache store. You have to pass the `KeyPrefix` for the `cacheKey` to return the values that you stored via the [set method](#set). Or use the [get method](#get) instead.

### `getStorageKeys`
___

> `getStorageKeys()`

Returns all `cacheKeys` as string array that start with the `KeyPrefix` but without the `_expired` keys.

## Decorators
___

The caching decorators are helpful if you want to achieve a lot with less code and also fast. 
They help you to program your methods with logic only, without having to take caching into care. 
The decorators automatically return the cached value if it exists and has not expired (without calling the logic of the method). 
If there is nothing in the cache or the cache has expired, the logic of the method is called and the return value is automatically written to the cache.

In order to better understand how decorators work, I recommend reading [this article](https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841). 

> **Simple definition**: An ES2016 decorator is an expression which returns a function and can take a target, name and property descriptor as arguments. You apply it by prefixing the decorator with an @ character and placing this at the very top of what you are trying to decorate. Decorators can be defined for either a class, a method or a property.

Let's compare the same code **without** decorators and **with** decorators. The logic is not changed, but the result is the same:

### Simple class WITHOUT decorators

```typescript
class MyExampleClass {

    private sesssionStorage: SessionStorage

    constructor() {
        this.sesssionStorage = new SessionStorage();
    }

    public getDummyDataPromise(): Promise<string> {

        this.sesssionStorage.logger.log("getDummyDataPromise START");
        const cacheKey: string = "getDummyDataPromise";
        const cacheData = this.sesssionStorage.get(cacheKey);
        
        if(cacheData != null) {
            this.sesssionStorage.logger.log("getDummyDataPromise get from cache");
            return Promise.resolve(cacheData);
        }

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const data = "This data is from 5s Promise";
                this.sesssionStorage.logger.log("getDummyDataPromise get from Promise");
                this.sesssionStorage.set(cacheKey, data);
                resolve(data);
            }, 5000);
        });
    }
}
```

### (Same) Simple class WITH decorators

```typescript linenums="1" title="(Same) Simple class WITH decorators"
class MyExampleClass {
    @sessionCache({
        key: "getDummyDataPromise"
    })
    public getDummyDataPromise(): Promise<string> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const data = "This data is from 5s Promise";
                resolve(data);
            }, 5000);
        });

    }
}
```


Needless to say, decorators save a lot of time, reduce the number of lines (29 lines vs. 14 lines (~50% less)) and improve readability.


### How to use decorators
___

> **INFO**: To use the method decorators, you must set the `experimentalDecorators` property in your `tsconfig.json` to `true`.

Here is a list of all available `method` decorators:


| Decorator name                        | Description                        |
|---------------------------------------|------------------------------------|
| `@sessionCache`                       | Return the cached value from `sessionStorage` (by the specified `cacheKey`) or store the return value of the method if the cache has expired or is not exists |
| `@localCache`                         | Return the cached value from `localStorage` (by the specified `cacheKey`) or store the return value of the method if the cache has expired or is not exists   |
| `@clearSessionCache`                  | Removes the cached value from the `sessionStorage` (by the given `cacheKey`)                                                                                  |
| `@clearLocalCache`                    | Removes the cached value from the `localStorage` (by the given `cacheKey`)                                                                                    |


In order to use the decorators, they must be imported

```typescript title="import decorators"
export { sessionCache, localCache, clearSessionCache, clearLocalCache  } from '@spfxappdev/storage';
```

### `@sessionCache`
___

The `storageCache` decorator stores the returned value of the method in the `sessionStorage` with the specified `key`. The code of the method is executed only if the cache has expired or does not exist. Additional [options](#options-isessionstoragedecoratoroptionst) can be passed to the decorator.

#### Options (`ISessionStorageDecoratorOptions<T>`)

| Name                                  | Type                                    | Required | Description                        |  Default Value                        |
|---------------------------------------|-----------------------------------------|----------|------------------------------------|---------------------------------------|
| `key`                                 | `string | KeyFunction`                  | Yes      | A `cacheKey` as a `string` to be used for storage. Or `KeyFunction`, a `function` that returns a `string`. [Here](#keyfunction) you can find more information about this function. | - |
| `timeToLife`                          | `number`                                | No       | The `timeToLife` option is optional and determines when the cache should expire (in minutes). | `SessionStorage.DefaultSettings.DefaultTimeToLife` see [here](#5-custom-settings) | - |
| `keyPrefix`                           | `string`                                | No       | The prefix that is inserted before the `cacheKey` | `SessionStorage.DefaultSettings.KeyPrefix` see [here](#5-custom-settings) | - |
| `sourceObj<T>`                        | `T`                                     | No       | If `convertFromCache` option is not set but `sourceObj` is, a new instance of `T` is created (=> parameterless `public costructor()` needed). After that all properties are set via `Object.assign`. [See samples](#assign-properties-to-class-via-sourceobj)  | - |
| `convertFromCache(cachedValue: any)`  | `function`                              | No       | When objects are stored in the storage, they are serialized via `JSON.stringify()`. This means that all methods and `properties` that only have a `getter` will not be stored. In reverse it means that in `storage.get()` these methods and `getter` properties are also not present. If these methods and properties are to be returned, you can implement your own logic through this function that converts the cached value to the required object. [See samples](#assign-properties-to-class-via-convertfromcache-method) | - |
 

### `@localCache`
___

The `localCache` decorator stores the returned value of the method in the `localStorage` with the specified `key`. The code of the method is executed only if the cache has expired or does not exist. Additional [options](#options-ilocalstoragedecoratoroptionst) can be passed to the decorator.

#### Options (`ILocalStorageDecoratorOptions<T>`)

| Name                                  | Type                                    | Required | Description                        |  Default Value                        |
|---------------------------------------|-----------------------------------------|----------|------------------------------------|---------------------------------------|
| `key`                                 | `string | KeyFunction`                  | Yes      | A `cacheKey` as a `string` to be used for storage. Or `KeyFunction`, a `function` that returns a `string`. [Here](#keyfunction) you can find more information about this function. | - |
| `timeToLife`                          | `number`                                | No       | The `timeToLife` option is optional and determines when the cache should expire (in minutes). | `LocalStorage.DefaultSettings.DefaultTimeToLife` see [here](#5-custom-settings) | - |
| `keyPrefix`                           | `string`                                | No       | The prefix that is inserted before the `cacheKey` | `LocalStorage.DefaultSettings.KeyPrefix` see [here](#5-custom-settings) | - |
| `sourceObj<T>`                        | `T`                                     | No       | If `convertFromCache` option is not set but `sourceObj` is, a new instance of `T` is created (=> parameterless `public costructor()` needed). After that all properties are set via `Object.assign`. [See samples](#assign-properties-to-class-via-sourceobj)  | - |
| `convertFromCache(cachedValue: any)`  | `function`                              | No       | When objects are stored in the storage, they are serialized via `JSON.stringify()`. This means that all methods and `properties` that only have a `getter` will not be stored. In reverse it means that in `storage.get()` these methods and `getter` properties are also not present. If these methods and properties are to be returned, you can implement your own logic through this function that converts the cached value to the required object. [See samples](#assign-properties-to-class-via-convertfromcache-method) | - | 

### `@clearSessionCache`
___

With the `clearSessionCache` decorator a value with the given `key` can be removed from the `sessionStorage`. Additional [options](#options-ilocalstoragedecoratoroptionst) can be passed to the decorator.

#### Options (`IClearSessionStorageDecoratorOptions`)

| Name        | Type                   | Required | Description                        |  Default Value                        |
|-------------|------------------------|----------|------------------------------------|---------------------------------------|
| `key`       | `string | KeyFunction` | Yes      | The `cacheKey` (without `keyPrefix`) that should be removed from the storage. The `key` can be a `string` or `KeyFunction` (a `function` that returns a `string`) [Here](#keyfunction) you can find more information about this function. | - |
| `keyPrefix` | `string`              | No       | The prefix that is inserted before the `cacheKey` | `SessionStorage.DefaultSettings.KeyPrefix` see [here](#5-custom-settings) |
| `when`      | `function`            | No       | `when` is an optional `function` which expects a `boolean` as return value. If `true` is returned, the `cacheKey` will be removed from the storage, otherwise not. In the function the `this.`-pointer can be used to access the class instance. In addition, all other passing parameters of the method to which the decorator is applied are also present (Exactly the same as with the [KeyFunction](#keyfunction) or [see samples](#clearlocalcache-combined-with-localcache)).  | - |


### `@clearLocalCache`
___ 

With the `clearLocalCache` decorator a value with the given `key` can be removed from the `localStorage`. Additional [options](#options-iclearlocalstoragedecoratoroptions) can be passed to the decorator.

#### Options (`IClearLocalStorageDecoratorOptions`)

| Name        | Type                   | Required | Description                        |  Default Value                        |
|-------------|------------------------|----------|------------------------------------|---------------------------------------|
| `key`       | `string | KeyFunction` | Yes      | The `cacheKey` (without `keyPrefix`) that should be removed from the storage. The `key` can be a `string` or `KeyFunction` (a `function` that returns a `string`) [Here](#keyfunction) you can find more information about this function. | - |
| `keyPrefix` | `string`              | No       | The prefix that is inserted before the `cacheKey` | `LocalStorage.DefaultSettings.KeyPrefix` see [here](#5-custom-settings) |
| `when`      | `function`            | No       | `when` is an optional `function` which expects a `boolean` as return value. If `true` is returned, the `cacheKey` will be removed from the storage, otherwise not. In the function the `this.`-pointer can be used to access the class instance. In addition, all other passing parameters of the method to which the decorator is applied are also present (Exactly the same as with the [KeyFunction](#keyfunction) or [see samples](#clearlocalcache-combined-with-localcache)). | - |

### `KeyFunction`
___

This type is a `function` which expects a `string` as return value. In the function the `this.`-pointer can be used to access the class instance. In addition, all other passing parameters of the method to which the decorator is applied are also present


#### Example with key as function

```typescript 
class MyExampleClass {

    private cacheKey: string = 'getDummyDataPromise';

    @sessionCache({
        key: (param1: string, param2: number, paramN: any): string => {
            return (this as MyExampleClass).cacheKey;
        }
    })
    public getDummyDataPromise(param1: string, param2: number, paramN: any): Promise<string> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const data = "This data is from 5s Promise";
                resolve(data);
            }, 5000);
        });

    }
}
```
As you can see in `line 6`, the parameters are the same as in the method (`line 10`). In `line 7` you can see how to access the current class instance.

### Decorator examples
___

#### Simple local cache decorator example
___

```typescript
class MyExampleClass {

    @localCache({
        key: "getDummyDataPromise"
    })
    public getDummyDataPromise(param1: string, param2: number, paramN: any): Promise<string> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const data = "This data is from 5s Promise";
                resolve(data);
            }, 5000);
        });

    }
}
```

#### Local cache decorator with key prefix
___

```typescript
class MyExampleClass {

    @localCache({
        key: "getDummyDataPromise",
        // The generated storage keys are `HelloSPFx_getDummyDataPromise` and `HelloSPFx_getDummyDataPromise_expire`
        keyPrefix: 'HelloSPFx_' 
    })
    public async getDummyDataPromise(param1: string, param2: number, paramN: any): Promise<string> {
        return await anyPromiseFunc(param1, param2, paramN);
    }
}
```

#### Assign properties to class via `sourceObj`
___

```typescript
class SimpleClassToConvert {
    public prop1: string;
    public prop2: string;
    public prop3: number;

    public setDefaultProps(): void {
        this.prop1 = "Hello";
        this.prop2 = "SPFxAppDev";
        this.prop3 = 42;
    }

    public anotherFunc() {

    }
}

class MyConvertFromSourceSampleClass {

    @localCache<SimpleClassToConvert>({
        key: "MyConvertFromSourceSampleClass_getDummyDataPromise",
        sourceObj: SimpleClassToConvert
    })
    public getDummyDataPromise(): Promise<SimpleClassToConvert> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const data = new SimpleClassToConvert();
                data.setDefaultProps();
                resolve(data);
            }, 5000);
        });

    }
}

const convertFromSource = new MyConvertFromSourceSampleClass();
(async function() {

    const simpleClassObj = await convertFromSource.getDummyDataPromise();
    //Working with the simpleClassObj...
    //No matter if it comes from the cache or from the method, in both cases the object is returned with all methods and properties.
})();
```

#### Assign properties to class via `convertFromCache`-method
___

```typescript
class DataClassToConvert {
    public readonly id: string;

    public get isPublished(): boolean {
        return this.version > 0;
    }

    public version: number;

    private constructor(id: string) {
        this.id = id;
        this.version = 0;
    }

    public static ConvertFromCacheCollection(cachedValue: any): DataClassToConvert[] {

        const resultValue: DataClassToConvert[] = [];
        (cachedValue as Array<any>).forEach((val: any) => {
            
            const instance = new DataClassToConvert(val.id);
            (Object as any).assign(instance, val);
            resultValue.push(instance);
        });

        return resultValue;
    }

    public static CreateDummyData(): DataClassToConvert[] {
        const resultValue: DataClassToConvert[] = [];

        const c1 = new DataClassToConvert("abc");
        resultValue.push(c1);

        const c2 = new DataClassToConvert("def");
        c2.version = 1;
        resultValue.push(c2);       

        return resultValue;
    }

}

class MyConvertFromCacheSampleClass {

    @localCache({
        key: "MyConvertFromCacheSampleClass_getDummyDataPromise",
        convertFromCache: (cachedValue) => {
            return DataClassToConvert.ConvertFromCacheCollection(cachedValue);
        }
    })
    public getDummyDataPromise(): Promise<DataClassToConvert[]> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const data = DataClassToConvert.CreateDummyData();
                resolve(data);
            }, 5000);
        });

    }
}

const convertFromCache = new MyConvertFromCacheSampleClass();
(async function() {

    const dataClassToConvertObj = await convertFromCache.getDummyDataPromise();
    //Working with the dataClassToConvertObj...
    //No matter if it comes from the cache or from the method, in both cases the object of type `DataClassToConvert` is returned with all methods and properties.
})();
```

#### Clear session cache
___

```typescript
class MyExampleClass {

    @clearSessionCache({
        key: "aKeyWithoutPrefix",
        //The "key prefix" is empty. This is useful if you want to remove a value from memory that has no prefix (for example from another application)
        keyPrefix: ''
    })
    public getDummyDataPromise(param1: string, param2: number, paramN: any): Promise<string> {
        return await anyPromiseFunc(param1, param2, paramN);
    }
}
```


#### `@clearLocalCache` combined with `@localCache`
___

```typescript
class MyExampleClass {

    @clearLocalCache({
        key: "myKey",
        when: (param1: string, refreshCache: boolean) => {
            //The parameters are the same as in the method (`line 12`). In the function the `this.`-pointer can be used to access the class instance
            return refreshCache;
        }
    })
    //The order is important. First you have to check if the cache should be cleared. Otherwise the `clearLocalCache` decorator will not be executed because the `localCache` method will not execute a method when returned value from the cache.
    @localCache({
        
        key: "myKey",
    })
    public getDummyDataPromise(param1: string, refreshCache: boolean): Promise<string> {
        return await anyPromiseFunc(param1, param2, paramN);
    }
}
```

## Clear storage via URL parameters
___

Via the URL parameters the stored data can be deleted either completely or only certain ones. The names of the parameters are defined globally or per instance (see [custom settings](#5-custom-settings)).

> **INFO**: Deleting via URL parameters only works if the cache has been called at least once on the page via the `get` method. For example, if only the `SessionStorage.get()` is used, then only `sessionStorage` will be cleared, but not `localStorage`. If nothing is used, then nothing is cleared. It is also applied only to the instances that use the same URL parameter configurations (`IStorageSettings.UrlParameter`) **AND** `keyPrefix`.

### Delete all via URL
___

By default, the URL parameter `ResetCache` is used for both `LocalStorage` and `SessionStorage`. If you want to set another one, you have to override it (see [custom settings](#5-custom-settings)).

If you want to clear the complete cache, you have to specify the corresponding URL parameter. The following example refers to the default URL parameter `ResetCache`. The value of the parameter does not matter, it just has to be present in the URL 

```
http://localhost:1234?ResetCache=1
```

### Remove only specific values via URL
___

By default, the URL parameter `ResetOnly` is used for both `LocalStorage` and `SessionStorage`. If you want to set another one, you have to override it (see [custom settings](#5-custom-settings)).

If you want to clear a specific value, you have to specify the corresponding URL parameter. The following example refers to the default URL parameter `ResetOnly`.

```
http://localhost:1234?ResetOnly=mySessionStorageKey
```

You can delete multiple cached values by separating the keys with a comma

```
http://localhost:1234?ResetOnly=mySessionStorageKey,myLocalStorageKey
```