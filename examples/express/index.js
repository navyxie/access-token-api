var express = require('express');
var serveStatic = require('serve-static');
var accessTokenApi = require('access-token-api');
var accessTokenCount = 3;
var TokenApi = new accessTokenApi({
    webTokenVarName: 'encrypt_api_tokenStr', //default to encrypt_api_tokenStr
});

function verifyToken(token, cb) {
    TokenApi.verify(token, function(err, count) {
        if (!err) {
            if (count) {
                TokenApi.decline(token, function(err, count) {
                    cb(err, true);
                })
            } else {
                TokenApi.remove(token, function(rmErr, rmFlag) {
                    cb(err, false);
                })
            }
        } else {
            cb(err, false);
        }
    })
}

var app = express();

//middleware
app.set('view engine', 'jade');
app.use(serveStatic('public/', {
    'index': ['index.html', 'index.htm']
}));
//inject access token into req
app.use(function(req, res, next) {
        TokenApi.issue(10, accessTokenCount, function(err, token) {
            if (!err && token) {
                req._access_token = token;
            }
            next();
        })
    })
    //route page
app.get('/', function(req, res) {
    res.render('access-token', {
        title: 'access-token',
        message: 'access-token!',
        accessTokenCount: accessTokenCount
    }, function(err, html) {
        if (err) {
            return res.send(err);
        }
        if (!req._access_token) {
            return res.send(html);
        }
        TokenApi.webInject(html, req._access_token, function(err, html) {
            res.send(html);
        })
    });
});
app.get('/no-access-token', function(req, res) {
    res.render('no-access-token', {
        title: 'no-access-token',
        message: 'no-access-token!'
    });
});

//route api

app.get('/api/access-token/get', function(req, res) {
    verifyToken(req.query._accessToken, function(err, passed) {
        if (!err && passed) {
            res.status(200).json({
                code: 0,
                msg: 'access was passed'
            })
        } else {
            res.status(200).json({
                code: -1,
                msg: 'access was denied'
            })
        }
    })
});

app.get('/api/no-access-token/get', function(req, res) {
    res.status(200).json({
        code: 0,
        msg: 'access was passed'
    })
});

app.listen(3000);
console.log('Demo is running at http://localhost:3000/. Press Ctrl+C to stop.')