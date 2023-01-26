import { isNullOrEmpty, isset, isFunction, toBoolean, getUrlParameter } from '@spfxappdev/utility';
import { Logger } from '@spfxappdev/logger';


const defaultStorageSettings: IStorageSettings  = {
    UrlParameter: {
        RefreshAll: 'ResetCache',
        RefreshOnly: 'ResetOnly'
    },
    DefaultTimeToLife: 60,
    KeyPrefix: 'SPFxAppDev_'
}

const sessionStorageSettings = {...{}, ...defaultStorageSettings};
const localStorageSettings = {...{}, ...defaultStorageSettings};

export interface IStorageSettings {
    UrlParameter: IStorageUrlParameters;
    DefaultTimeToLife: number;
    KeyPrefix: string;
}

export interface IStorageUrlParameters {
    RefreshAll: string;
    RefreshOnly: string;
}

export abstract class StorageBase {

    protected cache: Storage;
    protected Settings: IStorageSettings;

    private expiredCacheKeySuffix: string = '_expire';
    private cacheLogCategory: string = 'SPFxAppDevCaching';

    public logger: Logger;

    /**
     * Get's the Value associated with the specified CacheKey from the Local-/Session- Storage.
     * @param {string} cacheKey The specified Key for the Cache.
     * @param {Function|null} delegateFunction The delegate Function which if set is Called to refresh the Value in the Cache.
     * @param {number} timeToLife The Time 'til the Cache expires in Minutes.
     */
    public get(cacheKey: string, delegateFunction: Function|null = null, timeToLife: number = this.Settings.DefaultTimeToLife): any {

        if (isNullOrEmpty(cacheKey)) {
            this.warn('cacheKey is required and cannot be null or empty');
            return null;
        }

        const originalCacheKey: string = cacheKey;
        cacheKey = this.Settings.KeyPrefix + cacheKey;

        if (!isset(timeToLife)) {
            this.info('timeToLife is not set. Use default time to life of ' + this.Settings.DefaultTimeToLife + ' minutes.');
            timeToLife = this.Settings.DefaultTimeToLife;
        }

        const cache: Storage = this.cache;

        // Browser-Support-Check
        if (!isset(cache)) {
            if (isFunction(delegateFunction)) {
                this.warn('call delegate function because browser does not support this storage type');
                const valueToCache: any = delegateFunction();
                return valueToCache;
            }

            this.warn('The browser does not support this storage type and the delagte function is null');
            return null;
        }

        const refreshCacheValue: string = this.getUrlParameter(this.Settings.UrlParameter.RefreshAll);
        const refreshSpecific: string = this.getUrlParameter(this.Settings.UrlParameter.RefreshOnly);

        let refreshCache: boolean = toBoolean(refreshCacheValue);
        let cacheWasRemoved: boolean = (window as any).SPFxAppDevCachingWasRemoved || false;

        if (refreshCache && !isset((window as any).SPFxAppDevCachingWasRemoved)) {
            this.log('remove all caching values. Because URL-Parameter is set');
            this.clear();
            (window as any).SPFxAppDevCachingWasRemoved = true;
            cacheWasRemoved = true;
        }

        if (!refreshCache &&
            isset(refreshSpecific)) {
            const keyArray: string[] = refreshSpecific.toLowerCase().split(',');

            for (let index: number = 0; index < keyArray.length; index++) {
                if (keyArray[index] !== originalCacheKey.toLowerCase()) {
                    continue;
                }

                refreshCache = true;
                cacheWasRemoved = true;
                this.log('remove cache with key ' + cacheKey + '. Because URL-Parameter is set');
                break;
            }
        }

        // Do not clear again, because it was already done
        if (isset((window as any).SPFxAppDevCachingWasRemoved)) {
            refreshCache = false;
        }

        const expireKey: string = cacheKey + this.expiredCacheKeySuffix;
        const isExpired: boolean = refreshCache || this.cacheIsExpired(cache.getItem(expireKey));

        if (isExpired) {
            this.remove(originalCacheKey);
        }
        
        const cacheValue: string = cacheWasRemoved ? null : cache.getItem(cacheKey);

        if (isset(cacheValue)) {
            this.log('return cached value with key ' + originalCacheKey);
            let cacheReturnValue: any = null;

            try {
                cacheReturnValue = JSON.parse(cacheValue);
            } catch (e) {
                this.log('Could not parse JSON-String with value: ' + cacheValue);
                /* tslint:disable:no-eval */
                cacheReturnValue = eval('(' + cacheValue + ')');
            }

            return cacheReturnValue;
        }

        if (isFunction(delegateFunction)) {
            this.log('call delegate function to get the data and set in cache, because data is expired for cache with key ' + originalCacheKey);
            const valueToCache: any = delegateFunction();
            this.set(originalCacheKey, valueToCache, timeToLife);
            return valueToCache;
        }

        this.warn('cannot execute the delegate function, because it is not defined or not a function');
        return null;
    }

    /**
     * Set's the Value under the specified CacheKey in the Local-/Session- Storage.
     * @param {string} cacheKey The specified Key for the Cache.
     * @param {any} cacheValue The Value to be set in the Cache.
     * @param {number} timeToLife The Time 'til the Cache expires in Minutes.
     */
    public set(cacheKey: string, cacheValue: any, timeToLife: number = this.Settings.DefaultTimeToLife): void {
        if (isNullOrEmpty(cacheKey)) {
            this.warn('cacheKey is required and cannot be null or empty');
            return;
        }

        cacheKey = this.Settings.KeyPrefix + cacheKey;

        if (!isset(timeToLife)) {
            this.info('timeToLife is not set. Use default time to life of ' + this.Settings.DefaultTimeToLife + ' minutes.');
            timeToLife = this.Settings.DefaultTimeToLife;
        }

        const cache: Storage = this.cache;

        // Browser-Support-Check
        if (!isset(cache)) {
            this.warn('The browser does not support this storage type and the delagte function is null');
            return;
        }

        try {
            cacheValue = JSON.stringify(cacheValue);
            // Set the Value to cache
            cache.setItem(cacheKey, cacheValue);

            // Set the expired date
            const currentTime: Date = new Date();
            currentTime.setMinutes(currentTime.getMinutes() + timeToLife);
            const expireKey: string = cacheKey + this.expiredCacheKeySuffix;
            cache.setItem(expireKey, currentTime.getTime().toString());
        } catch (e) {
            this.log('Could not set cache value for key: ' + cacheKey);
        }
    }

    // /**
    //  * @param {boolean} includeUserId
    //  * @param {WebPartContext|ApplicationCustomizerContext} ctx
    //  */
    // public getWebSpecificCacheKey (includeUserId: boolean, ctx: WebPartContext|ApplicationCustomizerContext): string {
    //     const loginName: string = ctx.pageContext.user.loginName.replace(/[^\w\s]/gi, '_');
    //     const userKey: string = includeUserId ? ('_user_' + loginName) : '';
    //     return ctx.pageContext.web.id.toString().replace(/[^\w\s]/gi, '') + userKey;
    // }

    /**
     * Removes item from Cache based on the Key.
     * @param {string} cacheKey The Key within the Cache.
     */
    public remove(cacheKey: string): void {
        this.log('remove cache with key ' + cacheKey);
        cacheKey = this.Settings.KeyPrefix + cacheKey;
        const expiresCacheKey: string = cacheKey + this.expiredCacheKeySuffix;
        this.removeFromCache(cacheKey, expiresCacheKey);
    }

    /**
     * Removes every Key from the Cache/ Clears the Cache
     */
    public clear(): void {

        const cache: Storage = this.cache;

        if (!isset(cache)) {
            return;
        }

        for (let i: number = cache.length - 1; i >= 0; i--) {
            let key: string = cache.key(i);

            if (key.toLowerCase().indexOf(this.Settings.KeyPrefix.toLowerCase()) !== 0) {
                continue;
            }

            key = key.replace(this.Settings.KeyPrefix, '');
            this.remove(key);
        }
    }

    /**
     * checks if an item exist in cache by cacheKey
     * IMPORTANT: this is the generell getItem-Methode of the cache store. You have to pass the prefix for the cacheKey
     * as well to return the values that you stored via the this.set()-Methode or use the this.get()-Methode instead
     * @param {string} cacheKey The Key to determine.
     * @returns {boolean} <c>true</c> if the Key exists within the Cache, else <c>false</c>.
     */
    public exists(cacheKey: string): boolean {
        return isset(this.cache) && isset(this.cache.getItem(cacheKey));
    }

    /**
     * @returns {string[]} An Array of all CacheKeys.
     */
    public getStorageKeys(): string[] {
        const storageCache: Storage = this.cache;

        const keyArray: string[] = [];

        if (!isset(storageCache)) {
            return keyArray;
        }

        for (const keyName in storageCache) {
            if (typeof storageCache[keyName] === 'string' &&
                keyName.indexOf(this.Settings.KeyPrefix) === 0 &&
                keyName.indexOf(this.expiredCacheKeySuffix) < 0) {
                    keyArray.push(keyName);
            }
        }

        return keyArray;
    }

    protected constructor(storage: Storage, settings: IStorageSettings = defaultStorageSettings) {
        this.cache = storage;
        this.Settings = settings;
        this.logger = new Logger(this.cacheLogCategory);
    }

    protected cacheIsExpired(expiredDate: any): boolean {
        if (!isset(expiredDate)) {
            return true;
        }

        const currentTime: Date = new Date();
        const expiresIn: number = parseInt(expiredDate, 10);
        const timeInCache: Date = new Date(expiresIn);

        return currentTime > timeInCache;
    }

    protected getUrlParameter(parameterName: string): string {
        return getUrlParameter(parameterName);
    }

    protected log(text: any): void {
        this.logger.log(text);
    }

    protected warn(text: any): void {
        this.logger.warn(text);
    }

    protected info(text: any): void {
        this.logger.info(text);
    }

    private removeFromCache(cacheKey: string, cacheExpireKey: string): string {
        if (!isset(this.cache)) {
            this.log('removeFromCache this.cache is not set');
            return;
        }

        this.cache.removeItem(cacheKey);
        this.cache.removeItem(cacheExpireKey);
    }
}

export class SessionStorage extends StorageBase {

    public static DefaultSettings: IStorageSettings = sessionStorageSettings;

    /**
     * @param {IStorageSettings} customSettings Settings like a custom Key-Prefix or the Time to Live.
     */
    public constructor(customSettings: IStorageSettings = SessionStorage.DefaultSettings) {
        super(window.sessionStorage, customSettings);
    }
}

export class LocalStorage extends StorageBase {
    
    public static DefaultSettings: IStorageSettings = localStorageSettings;

    /**
     * @param {IStorageSettings} customSettings Settings like a custom Key-Prefix or the Time to Live.
     */
    public constructor(customSettings: IStorageSettings = LocalStorage.DefaultSettings) {
        super(window.localStorage, customSettings);
    }
}