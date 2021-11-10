
export interface IStorageDecoratorOptions<T> {
    key: string|((...args: any[]) => string);
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
    key: string|((...args: any[]) => string);
    keyPrefix?: string;
    when?(...args: any[]): boolean;
}

export interface IClearSessionStorageDecoratorOptions extends IClearStorageDecoratorOptions {
}

export interface IClearLocalStorageDecoratorOptions extends IClearStorageDecoratorOptions {
}