# access-token-api

a simple api access token support count and ttl ， which base on nodejs.

## install

```js
npm install access-token-api
```

## usage

```js
var redis = require("redis"),
  client = redis.createClient(6379,'localhost');
var accessTokenApi = require('access-token-api');

var TokenApi = new Token({
    storeConfig:{
        get:function(key,callback){
            client.GET(key,function(err,reply){
                callback(err,reply);
            });
        },
        set:function(key,data,ttl,callback){
            client.PSETEX(key,ttl,data,function(err,reply){
                callback(err,reply);
            });
        },
        remove:function(key,callback){
            client.DEL(key,function(err,data){
              callback(err);
            });
        }
    },
    webTokenVarName:'encrypt_api_tokenStr',//default to encrypt_api_tokenStr
    webInject:function(){
        //if you want to custom you webtoken inject in hmlt , you can do in this function.
    }
});

TokenApi.issue(10,10,function(err,token){
    //todo
});
TokenApi.verify('token',function(err,count){
    //todo
});
```

**web page get token by window[webTokenVarName] , default to window.encrypt_api_tokenStr**


## API

- [`issue`](#issue)

- [`verify`](#verify)

- [`remove`](#remove)

- [`decline`](#decline)

- [`webInject`](#webInject)

<a name="issue" />

issue

```js
TokenApi.issue(10,5,function(err,data){
  console.log(err,data);
})
```

<a name="verify" />

verify

```js
TokenApi.verify('token',function(err,data){
  console.log(err,data);
})
```

<a name="remove" />

remove

```js
TokenApi.remove('token',function(err,data){
  console.log(err,data);
})
```

<a name="decline" />

decline

```js
TokenApi.decline('token',function(err,data){
  console.log(err);
})
```

<a name="webInject" />

webInject

```js
TokenApi.webInject('html','token',function(err,html){
      console.log(err);
})
```


## test

 ```js
 npm test
 ```