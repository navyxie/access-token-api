var should = require('should');
var Token = require('../lib/index');
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
      }
    };
    config.decline = function(key,callback){
      config.get(token,function(err,data){
        if(!err && data){
          config.set(token,--data.data,function(err,data){
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
    it('timeout',function(done){
      setTimeout(function(){
        TokenInstance.verify(token,function(err,data){
          should.exists(err);
          done(null);
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