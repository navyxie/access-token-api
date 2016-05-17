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
  store.set(randomToken(),count,ttl,cb);
}

Token.prototype.verify = function(token,cb){
  var store = this.store;
  store.get(token,cb);
}

Token.prototype.remove = function(token,cb){
  var store = this.store;
  store.remove(token,cb);
}

Token.prototype.dec = function(token,cb){
  var store = this.store;
  this.verify(token,function(err,data){
    if(!err){
      that.set(token,data.data - 1,cb);
    }else{
      cb(err);
    }
  })
}

module.exports = Token;