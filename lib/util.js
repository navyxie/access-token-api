var SALTCHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
var htmlTags = ['b','big','i','small','tt','abbr','acronym','cite','code','dfn','em','kbd','strong','samp','time','bdo','map','q','span','sub','sup','button','label'];
module.exports = {
  generateSalt:function(length){
    var i, r = [];
    for (i = 0; i < length; ++i) {
      r.push(SALTCHARS[Math.floor(Math.random() * SALTCHARS.length)]);
    }
    return r.join('');
  },
  matchHtmlTags:function(html){
    var reg = new RegExp(/<\/[^>]+>/gim);
    var lastIndexs = [];
    var result;
    while((result = reg.exec(html)) != null){
      lastIndexs.push(reg.lastIndex);
    }
    return lastIndexs;
  },
  makeHtmlTag:function(id,val){
    var tag = this.randomHtmlTagName();
    return '<'+tag+' id="'+id+'" style="display:none;">' + val + '</'+tag+'>';
  },
  randomHtmlTagName:function(){
    return htmlTags[Math.floor(Math.random()*htmlTags.length)];
  }
}