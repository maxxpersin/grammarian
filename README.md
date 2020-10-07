Custom KEY_PROTECTION class must be created under /server/secret/keyprotection.js
The class should look something like
```
class KEY_PROTECTION
{
    key;
    constructor(){
        this.key = "YOUR KEY HERE";
    }
}

module.exports = KEY_PROTECTION;

```


Run Express server with:
```
grammarian\server> npm run serve
```

Run Angular dev server with proxy config enabled:
```
grammarian\client\grammarian> npm run proxy
```
