//  import { IStorageSettings, LocalStorage, SessionStorage, IStorageUrlParameters } from '@spfxappdev/storage';
import { IStorageSettings, LocalStorage, SessionStorage, IStorageUrlParameters, localCache } from '../../src/index';


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



const t1 = new TestStorageClassNormal();
console.log(t1.getDummyDataWithCallback());
console.log(t1.getDummyDataPromise());

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

const t2 = new TestStorageClassDecorators();
console.log(t2.getDummyDataWithCallback());
console.log(t2.getDummyDataPromise());