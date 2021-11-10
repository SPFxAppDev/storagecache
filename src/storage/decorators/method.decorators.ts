import { ISessionStorageDecoratorOptions, ILocalStorageDecoratorOptions, IClearLocalStorageDecoratorOptions, IClearSessionStorageDecoratorOptions } from './options.decorators';
import { isset, isFunction } from '@spfxappdev/utility';
import '../../utility/functions/library/assignObject';
import { LocalStorage, SessionStorage, StorageBase, IStorageSettings } from '../Storage';

const sessionStorageDefaultSettings: IStorageSettings = SessionStorage.DefaultSettings;
const localStorageDefaultSettings: IStorageSettings = LocalStorage.DefaultSettings;

class Factory<T extends Object> {
    constructor(private objToCreate: new () => T) {
    }

    public create(): T {
        return new this.objToCreate();
    }
}

export const sessionCache: <T>(options: ISessionStorageDecoratorOptions<T>) => any = <T>(options: ISessionStorageDecoratorOptions<T>): any => {

    const defaultSessionStorageOptions: ISessionStorageDecoratorOptions<T> = {
        key: null,
        timeToLife: sessionStorageDefaultSettings.DefaultTimeToLife,
        keyPrefix: sessionStorageDefaultSettings.KeyPrefix
    };

    options = {...defaultSessionStorageOptions, ...options};

    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>): any => {

        const originalMethod: any = descriptor.value;

        descriptor.value = function(): any {
            const storage: SessionStorage = new SessionStorage({
                KeyPrefix: options.keyPrefix,
                DefaultTimeToLife: options.timeToLife,
                UrlParameter: sessionStorageDefaultSettings.UrlParameter
            });

            return getFromStorageOrTarget(storage, options, originalMethod, this, propertyKey, descriptor, arguments);
        };
    };
};

export const localCache: <T>(options: ISessionStorageDecoratorOptions<T>) => any = <T>(options: ISessionStorageDecoratorOptions<T>): any => {

    const defaultLocalStorageOptions: ILocalStorageDecoratorOptions<T> = {
        key: null,
        timeToLife: localStorageDefaultSettings.DefaultTimeToLife,
        keyPrefix: localStorageDefaultSettings.KeyPrefix
    };

    options = {...defaultLocalStorageOptions, ...options};

    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>): any => {

        const originalMethod: any = descriptor.value;

        descriptor.value = function(): any {
            const storage: LocalStorage = new LocalStorage({
                KeyPrefix: options.keyPrefix,
                DefaultTimeToLife: options.timeToLife,
                UrlParameter: localStorageDefaultSettings.UrlParameter
            });

            return getFromStorageOrTarget(storage, options, originalMethod, this, propertyKey, descriptor, arguments);
        };
    };
};

export const clearSessionCache: (options: IClearSessionStorageDecoratorOptions) => any = (options: IClearSessionStorageDecoratorOptions): any => {

    const defaultClearSessionStorageOptions: IClearSessionStorageDecoratorOptions = {
        key: null,
        keyPrefix: sessionStorageDefaultSettings.KeyPrefix
    };

    options = {...defaultClearSessionStorageOptions, ...options};

    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>): any => {

        const originalMethod: any = descriptor.value;

        descriptor.value = function(): any {

            const storage: SessionStorage = new SessionStorage({
                KeyPrefix: options.keyPrefix,
                DefaultTimeToLife: sessionStorageDefaultSettings.DefaultTimeToLife,
                UrlParameter: sessionStorageDefaultSettings.UrlParameter
            });

            removeFromStorage(storage, options, originalMethod, this, propertyKey, descriptor, arguments);
            const result: any = originalMethod.apply(this, arguments);

            if(!(result instanceof Promise)) {
                return result;
            }

            return Promise.resolve(result).then((value) => {
                return value;
            }).catch((error) => {
                storage.logger.error(`ERROR occurred in ${propertyKey}.clearSessionCache`);
                storage.logger.error(error);
                storage.logger.log(`${propertyKey} REMOVE Cache END`);
                return Promise.reject(error);
            });
        };
    };
};

export const clearLocalCache: (options: IClearLocalStorageDecoratorOptions) => any = (options: IClearLocalStorageDecoratorOptions): any => {
    const defaultClearLocalStorageOptions: IClearLocalStorageDecoratorOptions = {
        key: null,
        keyPrefix: localStorageDefaultSettings.KeyPrefix
    };

    options = {...defaultClearLocalStorageOptions, ...options};

    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>): any => {

        const originalMethod: any = descriptor.value;

        descriptor.value = function(): any {

            
            const storage: LocalStorage = new LocalStorage({
                KeyPrefix: options.keyPrefix,
                DefaultTimeToLife: localStorageDefaultSettings.DefaultTimeToLife,
                UrlParameter: localStorageDefaultSettings.UrlParameter
            });

            removeFromStorage(storage, options, originalMethod, this, propertyKey, descriptor, arguments);

            let result = originalMethod.apply(this, arguments);
            if(!(result instanceof Promise)) {
                return result;
            }

            return Promise.resolve(result).then((value) => {
                return value;
            }).catch((error) => {
                storage.logger.error(`ERROR occurred in ${propertyKey}.clearLocalCache`);
                storage.logger.error(error);
                storage.logger.log(`${propertyKey} REMOVE Cache END`);
                return Promise.reject(error);
            });
        };
    };
};

function getFromStorageOrTarget<T>(storage: StorageBase, options: ILocalStorageDecoratorOptions<T>|ISessionStorageDecoratorOptions<T>, originalMethod: any, target: any, propertyKey: string, descriptor: PropertyDescriptor, ...args: any[]): Promise<T> {

    const storageKey: string = typeof options.key == "function" ? options.key.apply(target, ...args) : options.key;
    const storageValue: any = storage.get(storageKey, undefined, options.timeToLife);
    let result: any = null;
    let setValueInCache: boolean = false;

    if (isset(storageValue)) {
        storage.logger.log(`${propertyKey} GET from Storage`);
        result = storageValue;

        if (!isFunction(options.convertFromCache) && typeof result === 'object' && isset(options.sourceObj)) {

            storage.logger.log(`${propertyKey} TRY to convert from sourceObj`);
            const fac: any = new Factory<T>(options.sourceObj as any).create();
            result = (Object as any).assign(fac, result);
            // result = assignObject(fac, result);
        } else if (isFunction(options.convertFromCache)) {
            storage.logger.log(`${propertyKey} TRY to convert from convertFromCache-Method`);
            result = options.convertFromCache.call(target, result);
        }
    } else {
        storage.logger.log(`${propertyKey} GET from Method-Logic`);
        setValueInCache = true;
        result = originalMethod.apply(target, ...args);
    }

    //If not loaded from storage and original Method ReturnType is not a promise
    if(!isset(storageValue) && !(result instanceof Promise)) {
        storage.logger.log(`${propertyKey} END`);

        if (setValueInCache) {
            storage.set(storageKey, result, options.timeToLife);
        }

        return result;
    }

    return Promise.resolve(result).then((value): T =>  {
        storage.logger.log(`${propertyKey} END`);

        if (setValueInCache) {
            storage.set(storageKey, value, options.timeToLife);
        }

        return value;
    }).catch((error) => {
        storage.logger.error(`ERROR occurred in ${propertyKey}`);
        storage.logger.error(error);
        storage.logger.log(`${propertyKey} END`);
        return Promise.reject(error);
    });
}

function removeFromStorage(storage: StorageBase, options: IClearLocalStorageDecoratorOptions|IClearSessionStorageDecoratorOptions, originalMethod: any, target: any, propertyKey: string, descriptor: PropertyDescriptor, ...args: any[]): void {

    let clear: boolean = true;

    storage.logger.log(`${propertyKey} Remove ${options.key} from cache`);

    if (isFunction(options.when)) {
        storage.logger.log(`${propertyKey} Remove from cache - when function is set, get Value from method`);
        console.log(target);
        clear = options.when.apply(target, ...args);
        storage.logger.log(`${propertyKey} clearCache is set to ${clear} from when-function`);
    }

    if (clear === false) {
        storage.logger.log(`${propertyKey} clearCache is set to false, skip removing`);
        return;
    }

    const storageKey: string = typeof options.key == "function" ? options.key.apply(target, ...args) : options.key;
    storage.remove(storageKey);
}