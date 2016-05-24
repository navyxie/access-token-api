var should = require('should');
var Token = require('../lib/index');
var _store = {};
describe("Token",function(){
  this.timeout(5000);
  describe("data save in memory",function(){
    var TokenInstance = new Token();
    var token;
    it("#issue()",function(done){
      TokenInstance.issue(10,function(err,data){
        token = data;
        should.exists(data);
        done(err);
      });
    });
    it('#verify()',function(done){
      TokenInstance.verify(token,function(err,data){
        data.should.be.equal(5);
        done(err);
      });
    });
    it('#decline()',function(done){
      TokenInstance.decline(token,function(err,data){
        data.should.be.equal(4);
        done(err);
      });
    });
    it('#remove()',function(done){
      TokenInstance.remove(token,function(err,data){
        data.should.be.equal(4);
        done(err);
      });
    });
    it('#verify()',function(done){
      TokenInstance.verify(token,function(err,data){
        should.exists(err);
        done(null);
      });
    });
    it('#issue()',function(done){
      TokenInstance.issue(3,3,function(err,data){
        token = data;
        should.exists(data);
        done(err);
      });
    });
    it('#decline()',function(done){
      TokenInstance.decline(token,function(err,data){
        data.should.be.equal(2);
        done(err);
      });
    });
    it('#verify()',function(done){
      TokenInstance.verify(token,function(err,data){
        data.should.be.equal(2);
        done(err);
      })
    });
    it('timeout',function(done){
      setTimeout(function(){
        TokenInstance.verify(token,function(err,data){
          should.exists(err);
          done(null);
        })
      },3000);
    });
  });
  describe('data in config with decline function',function(){
    var config = {
      set:function(key,data,ttl,callback){
        _store[key] = data;
        callback(null,data);
      },
      get:function(key,callback){
        callback(null,_store[key]);
      },
      remove:function(key,callback){
        var data = _store[key]
        delete _store[key];
        callback(null,data);
      },
      decline:function(key,callback){
        var that = this.store;
        that.get(key,function(err,data){
          if(!err && data){
            that.set(key,--data.data,function(err,data){
              if(!err && data){
                callback(null,data.data);
              }else{
                callback(err || 'can not decline token : ' + key + '.');
              }
            });
          }else{
            callback(err || 'not exists or expired token : ' + key + '.')
          }
        })
      }
    };
    var TokenInstance = new Token({storeConfig:config});
    var token;
    it("#issue()",function(done){
      TokenInstance.issue(10,function(err,data){
        token = data;
        should.exists(data);
        done(err);
      });
    });
    it('#verify()',function(done){
      TokenInstance.verify(token,function(err,data){
        data.should.be.equal(5);
        done(err);
      });
    });
    it('#decline()',function(done){
      TokenInstance.decline(token,function(err,data){
        data.should.be.equal(4);
        done(err);
      });
    });
    it('#remove()',function(done){
      TokenInstance.remove(token,function(err,data){
        data.should.be.equal(4);
        done(err);
      });
    });
    it('#verify()',function(done){
      TokenInstance.verify(token,function(err,data){
        should.exists(err);
        done(null);
      });
    });
    it('#issue()',function(done){
      TokenInstance.issue(3,3,function(err,data){
        token = data;
        should.exists(data);
        done(err);
      });
    });
    it('#decline()',function(done){
      TokenInstance.decline(token,function(err,data){
        data.should.be.equal(2);
        done(err);
      });
    });
    it('#verify()',function(done){
      TokenInstance.verify(token,function(err,data){
        data.should.be.equal(2);
        done(err);
      })
    });
    it('#webInject()',function(done){
      var html = '<html><head><title>test</title></head><body id="body"></body></html>';
      TokenInstance.webInject(html,token,function(err,html){
        html.should.be.containEql('w.encrypt_api_tokenStr');
        done(err);
      })
    });
    it('timeout',function(done){
      setTimeout(function(){
        TokenInstance.verify(token,function(err,data){
          // should.exists(err);
          done(err);
        })
      },3000);
    });
  });
  describe('data in config without decline function',function(){
    var config = {
      set:function(key,data,ttl,callback){
        _store[key] = data;
        callback(null,data);
      },
      get:function(key,callback){
        callback(null,_store[key]);
      },
      remove:function(key,callback){
        var data = _store[key]
        delete _store[key];
        callback(null,data);
      },
      webInject:function(html,token,callback){
        var htmlEndIndex = html.indexOf('</html>');
        var tokenScript = '<script>window.' + this.config.webTokenVarName + '=' + token + '</script>';
        var prevHtml = html.substring(0,htmlEndIndex);
        var nextHtml = html.substr(htmlEndIndex); 
        prevHtml += tokenScript;
        prevHtml += nextHtml;
        callback(null,prevHtml);
      }
    };
    var TokenInstance = new Token(config);
    var token;
    it("#issue()",function(done){
      TokenInstance.issue(10,function(err,data){
        token = data;
        should.exists(data);
        done(err);
      });
    });
    it('#verify()',function(done){
      TokenInstance.verify(token,function(err,data){
        data.should.be.equal(5);
        done(err);
      });
    });
    it('#decline()',function(done){
      TokenInstance.decline(token,function(err,data){
        data.should.be.equal(4);
        done(err);
      });
    });
    it('#remove()',function(done){
      TokenInstance.remove(token,function(err,data){
        data.should.be.equal(4);
        done(err);
      });
    });
    it('#verify()',function(done){
      TokenInstance.verify(token,function(err,data){
        should.exists(err);
        done(null);
      });
    });
    it('#issue()',function(done){
      TokenInstance.issue(3,3,function(err,data){
        token = data;
        should.exists(data);
        done(err);
      });
    });
    it('#decline()',function(done){
      TokenInstance.decline(token,function(err,data){
        data.should.be.equal(2);
        done(err);
      });
    });
    it('#verify()',function(done){
      TokenInstance.verify(token,function(err,data){
        data.should.be.equal(2);
        done(err);
      })
    });
    it('#webInject()',function(done){
      var html = '<html><head><title>test</title></head><body id="body"></body></html>';
      TokenInstance.webInject(html,token,function(err,html){
        html.should.be.containEql('window.encrypt_api_tokenStr');
        done(err);
      })
    });
    it('timeout',function(done){
      setTimeout(function(){
        TokenInstance.verify(token,function(err,data){
          should.exists(err);
          done(null);
        })
      },3000);
    });
  });
})