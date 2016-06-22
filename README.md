# access-token-api

[![Build Status via Travis CI](https://travis-ci.org/navyxie/access-token-api.svg?branch=master)](https://travis-ci.org/navyxie/access-token-api) [![Coverage Status](https://coveralls.io/repos/github/navyxie/access-token-api/badge.svg?branch=master)](https://coveralls.io/github/navyxie/access-token-api?branch=master) [![NPM version](https://badge.fury.io/js/access-token-api.png)](http://badge.fury.io/js/access-token-api)

A simple api access token support count and ttl,which base on nodejs. It can protect your api,prevent CSRF attacks, api called count with ttl.

## [examples](./examples)

- [express](./examples/express)
- [sails](./examples/sails)
- [static-server](./examples/static-server)

## install

```js
npm install access-token-api
```

## usage

Single Process

```js

`nodejs`

var accessTokenApi = require('access-token-api');
var TokenApi = new accessTokenApi({
    webTokenVarName:'encrypt_api_tokenStr',//default to encrypt_api_tokenStr
    webInject:function(html,token,callback){
        //if you want to custom you webtoken inject in hmlt , you can do in this function. example:
        var htmlEndIndex = html.indexOf('</html>');
        var tokenScript = '<script>window.' + this.config.webTokenVarName + '=' + token + '</script>';
        var prevHtml = html.substring(0, htmlEndIndex);
        var nextHtml = html.substr(htmlEndIndex);
        prevHtml += tokenScript;
        prevHtml += nextHtml;
        callback(null, prevHtml);
    }
});

`web javascript`

//get the token

window[webTokenVarName]
```


Multi Process

```js

`nodejs`

var redis = require("redis"),
  client = redis.createClient(6379,'localhost');
var accessTokenApi = require('access-token-api');

var TokenApi = new accessTokenApi({
    //store token in database(provide get , set, remove function)
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

> *storeConfig more params's config please to see [`store-ttl`](https://github.com/navyxie/store-ttl)*

**web page can get token by window[webTokenVarName] , default to window.encrypt_api_tokenStr**


## API

- [`issue`](#issue)

- [`limit`](#limit)

- [`pass`](#pass)

- [`verify`](#verify)

- [`remove`](#remove)

- [`decline`](#decline)

- [`webInject`](#webInject)

<a name="issue" />

`issue`

issue random token.

```js
/**
 * [issuse token]
 * @param  {[number]}   [token ttl, default unit is second]
 * @param  {[number]}   [token avalid count]
 * @return {[string]}         [return token]
 */
TokenApi.issue(10,5,function(err,data){
  console.log(err,data);
})

//issue given token
TokenApi.issue(10,5,'givenToken',function(err,data){
  console.log(err,data);//data is equal 'givenToken'
})
```

<a name="limit" />

`limit`

limit function call times with ttl.

```js
/**
 * [limit function call some time]
 * @param  {[number]}   [functionkey ttl, default unit is second]
 * @param  {[number]}   [function avalid count]
 * @return {[string]}         [return err]
 */

// apiname can call 5 times in 10 senconds
TokenApi.limit('apiname', 10, 5,function(err){
  if(!err){
    //todo
  }
})
```

<a name="pass" />

`pass`

verify and decline token times, when the token is valid.

```js
TokenApi.pass('token',function(err,data){
  console.log(err,data);//err ,data: {code:0, passed: true, count: 2}, when code is zero and passed is true, token is valid.
})
```

<a name="verify" />

`verify`

verify the token 

```js
TokenApi.verify('token',function(err,data){
  console.log(err,data);
})
```

<a name="remove" />

`remove`

remove the token

```js
TokenApi.remove('token',function(err,data){
  console.log(err,data);
})
```

<a name="decline" />

`decline`

decline the token times

```js
TokenApi.decline('token',function(err,data){
  console.log(err);
})
```

<a name="webInject" />

`webInject`

custom web frontend way to inject token into page

```js
TokenApi.webInject('html','token',function(err,html){
      console.log(err);
})
```


## test

 ```js
 //test
 npm test
 //coverage
 npm run cov
 ```

## publish log


 - 0.1.1
  add api limit , which one key can call some times with ttl.

 - 0.1.0
  issuse api support issue given token.
