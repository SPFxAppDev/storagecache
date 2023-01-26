
/**
 * This type is a function which expects a string as return value. 
 * In the function the this.-pointer can be used to access the class instance. 
 * In addition, all other passing parameters of the method to which the decorator is applied are also present
 */
export type KeyFunction = ((...args: any[]) => string);

export interface IStorageDecoratorOptions<T> {
    /**
     * A cacheKey as a string to be used for storage. Or KeyFunction, a function that returns a string
     */
    key: string|KeyFunction;

    /**
     * The timeToLife option is optional and determines when the cache should expire (in minutes).
     */
    timeToLife?: number;

    /**
     * The prefix that is inserted before the cacheKey
     */
    keyPrefix?: string;

    /**
     * If convertFromCache option is not set but sourceObj is, a new instance of T is created (=> parameterless public costructor() needed). After that all properties are set via Object.assign
     */
    sourceObj?: new () => T;

    /**
     * When objects are stored in the storage, they are serialized via JSON.stringify(). 
     * This means that all methods and properties that only have a getter will not be stored. 
     * In reverse it means that in storage.get() these methods and getter properties are also not present. 
     * If these methods and properties are to be returned, you can implement your own logic through this 
     * function that converts the cached value to the required object
     * @param cachedValue the parsed value from cache
     */
    convertFromCache?(cachedValue: any): T;
}

export interface ISessionStorageDecoratorOptions<T> extends IStorageDecoratorOptions<T> {
}

export interface ILocalStorageDecoratorOptions<T> extends IStorageDecoratorOptions<T> {
}

export interface IClearStorageDecoratorOptions {

    /**
     * The cacheKey (without keyPrefix) that should be removed from the storage. The key can be a string or KeyFunction (a function that returns a string)
     */
    key: string|KeyFunction;

    /**
     * The prefix that is inserted before the cacheKey
     */
    keyPrefix?: string;

    /**
     * Optional function which expects a boolean as return value. 
     * If true is returned, the cacheKey will be removed from the storage, otherwise not. 
     * In the function the this.-pointer can be used to access the class instance. 
     * In addition, all other passing parameters of the method to which the decorator is applied are also present
     * @param args  parameters of the method to which the decorator is applied
     */
    when?(...args: any[]): boolean;
}

export interface IClearSessionStorageDecoratorOptions extends IClearStorageDecoratorOptions {
}

export interface IClearLocalStorageDecoratorOptions extends IClearStorageDecoratorOptions {
}