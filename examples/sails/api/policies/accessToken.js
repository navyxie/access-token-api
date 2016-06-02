var TokenApi = require('../lib/accessToken');
var accessTokenCount = 3;
module.exports = function(req, res, next) {
    TokenApi.issue(10, accessTokenCount, function(err, token) {
        var path1 = 'get ' + req.path;
        var path2 = 'GET ' + req.path;
        var routerConfig = sails.router.explicitRoutes[path1];
        if (!routerConfig) {
            routerConfig = sails.router.explicitRoutes[path2];
        }
        if (!routerConfig) {
            return res.send('can not find router : ' + path1 + ' or ' + path2 + ' , please check.');
        }
        routerConfig.locals = routerConfig.locals || {};
        if (!err) {
            routerConfig.locals['csrf-token'] = token;
            res.view(routerConfig.view, routerConfig.locals, function(err, html) {
                if (err) {
                    return res.send(err);
                }
                TokenApi.webInject(html, token, function(err, html) {
                    res.send(html);
                })
            })
        } else {
            res.render(routerConfig.view, routerConfig.locals);
        }
    })
};