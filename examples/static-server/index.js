var http = require('http');
var accessTokenApi = require('access-token-api');
var accessTokenCount = 3;
var TokenApi = new accessTokenApi({
    webTokenVarName: 'encrypt_api_tokenStr', //default to encrypt_api_tokenStr
});
var fs = require('fs');
var hostname = 'localhost';
var port = 3002;
var server = http.createServer(function(req, res) {
    var assetsPath = process.cwd() + '/public';
    var htmlPath = assetsPath + '/index.html';
    var html = fs.readFileSync(htmlPath);
    res.setHeader('Content-Type', 'text/html');
    res.statusCode = 200;
    TokenApi.issue(10, accessTokenCount, function(err, token) {
        if (!err && token) {
            html = html.toString();
            TokenApi.webInject(html, token, function(err, html) {
                return res.end(html);
            });
        } else {
            res.end(html);
        }
    });
});
server.listen(port, hostname, function() {
    console.log('Server running at http://%s:%s/', hostname, port);
});