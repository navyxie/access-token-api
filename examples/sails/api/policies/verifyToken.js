var TokenApi = require('../lib/accessToken');
module.exports = function(req, res, next) {
    var token = req.param('_accessToken');
    if (!token) {
        return res.json(200, {
            code: -2,
            msg: 'request is invalid.'
        });
    }
    TokenApi.verify(token, function(err, count) {
        if (!err) {
            if (count) {
                TokenApi.decline(token, function(err, count) {
                    next();
                })
            } else {
                TokenApi.remove(token, function(rmErr, rmFlag) {
                    return res.json(200, {
                        code: -1,
                        msg: 'request is invalid.'
                    });
                })
            }
        } else {
            return res.json(200, {
                code: -3,
                msg: 'server busy.'
            });
        }
    })
}