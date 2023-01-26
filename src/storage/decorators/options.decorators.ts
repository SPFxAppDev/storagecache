
export type KeyFunction = ((...args: any[]) => string);

export interface IStorageDecoratorOptions<T> {
    key: string|KeyFunction;
    timeToLife?: number;
    keyPrefix?: string;
    sourceObj?: new () => T;
    convertFromCache?(cachedValue: any): T;
}

export interface ISessionStorageDecoratorOptions<T> extends IStorageDecoratorOptions<T> {
}

export interface ILocalStorageDecoratorOptions<T> extends IStorageDecoratorOptions<T> {
}

export interface IClearStorageDecoratorOptions {
    key: string|KeyFunction;
    keyPrefix?: string;
    when?(...args: any[]): boolean;
}

export interface IClearSessionStorageDecoratorOptions extends IClearStorageDecoratorOptions {
}

export interface IClearLocalStorageDecoratorOptions extends IClearStorageDecoratorOptions {
}