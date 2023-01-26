//  import { IStorageSettings, LocalStorage, SessionStorage, IStorageUrlParameters } from '@spfxappdev/storage';
import { IStorageSettings, LocalStorage, SessionStorage, IStorageUrlParameters, localCache, clearLocalCache } from '../../src/index';


const defaultLocalStorageSettingsOverride: IStorageSettings  = {
    UrlParameter: {
        RefreshAll: 'Reset',
        RefreshOnly: 'ResetOnly'
    },
    DefaultTimeToLife: 10,
    KeyPrefix: 'LocalDefault_10_Minutes_'
};

LocalStorage.DefaultSettings = defaultLocalStorageSettingsOverride;

const myCustomSettings: IStorageSettings = {...LocalStorage.DefaultSettings, ...{
    KeyPrefix: "TestLocal",
    DefaultTimeToLife: 5,
}};

const local = new LocalStorage(myCustomSettings);
local.set("now", new Date());

const session = new SessionStorage();
session.set("now", new Date());

const local2 = new LocalStorage();
local2.set("now", new Date());


class TestStorageClassNormal {

    private sesssionStorage: SessionStorage

    constructor() {
        this.sesssionStorage = new SessionStorage();
    }

    public getDummyDataWithCallback(): string {

        return this.sesssionStorage.get("DummyDataWithCallback", () => {
            return "This is the stored data";
        });

    }

    public getDummyDataPromise(): Promise<string> {

        this.sesssionStorage.logger.log("getDummyDataPromise START");
        const cacheKey: string = "getDummyDataPromise"
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



// const t1 = new TestStorageClassNormal();
// console.log(t1.getDummyDataWithCallback());
// console.log(t1.getDummyDataPromise());

class TestStorageClassDecorators {

    @localCache({
        key: "DummyDataWithCallbackDecorators"
    })
    public getDummyDataWithCallback(): string {
        return "This is the stored data";
    }

    @localCache({
        key: "getDummyDataPromiseDecorators"
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

class MyExampleClass {

    private cacheKey: string = 'MyExampleClass_getDummyDataPromise';

    @localCache({
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

// const t2 = new TestStorageClassDecorators();
// console.log(t2.getDummyDataWithCallback());
// console.log(t2.getDummyDataPromise());

// const convertFromSource = new MyConvertFromSourceSampleClass();
// (async function() {

//     const d = await convertFromSource.getDummyDataPromise();
//     console.log(d);
// })();

const convertFromCache = new MyConvertFromCacheSampleClass();
(async function() {

    const d = await convertFromCache.getDummyDataPromise();
    console.log(d);
})();
