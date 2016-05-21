var STORE = require('store-ttl');
var async = require('async');
var _ = require('lodash');

function randomToken(len){
  return Math.random().toString(len || 26).slice(2);
}

function Token(config){
  if(!_.isObject(config)){
    config = {};
  }
  config.storeConfig = config.storeConfig || {};
  config.count = config.count || 5;
  this.config = config;
  this.store = new STORE(config.storeConfig);
}

Token.prototype.issue = function(ttl,count,cb){
  var store = this.store;
  if(_.isFunction(count)){
    cb = count;
    count = this.config.count;
  }
  var token = randomToken();
  store.set(token,count,ttl,function(err,data){
    if(!err && data){
      cb(null,token);
    }else{
      cb(err || 'issue token error : ' + data);
    }
  });
}

Token.prototype.verify = function(token,cb){
  var store = this.store;
  store.get(token,function(err,data){
    if(!err && data){
      cb(null,data.data);
    }else{
      cb(err || 'token : ' + token + ' haved expire.')
    }
  });
}

Token.prototype.remove = function(token,cb){
  var store = this.store;
  store.remove(token,function(err,data){
    if(!err && data){
      cb(null,data.data)
    }else{
      cb(err || 'can not remove token : ' + token + '.');
    }
  });
}

Token.prototype.decline = function(token,cb){
  var store = this.store;
  if(Object.prototype.toString.call(store.config.decline) === "[object Function]"){
    return store.decline(token,cb);
  }else{
    store.get(token,function(err,data){
      if(!err && data){
        store.set(token,--data.data,(data.expire - Date.now())/1000,function(err,data){
          if(!err && data){
            cb(null,data.data);
          }else{
            cb(err || 'can not decline token : ' + token + '.');
          }
        });
      }else{
        cb(err || 'not exists or expired token : ' + token + '.')
      }
    })
  }
}

module.exports = Token;