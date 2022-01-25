# @spfxappdev/storage



## Installation

`npm i @spfxappdev/storage`

## Usage

1. import the storage class(es) into your project

```typescript
import { LocalStorage, SessionStorage } from '@spfxappdev/storage';
```

2. You can now create an instance.

```typescript
const storage = new SessionStorage();
```

3. Set/Get Data

```typescript
storage.set("now", new Date());
let dataFromCache = storage.get("now");
```

3. Get and set data (callback function)

```typescript
let dataFromCache = storage.get("now", () => { return new Date() });
```

For examples or documentation see [GitHub repository](https://github.com/SPFxAppDev/storagecache#readme)