module.exports = {
    getAccessToken: function(req, res) {
        res.json({
            code: 0,
            msg: 'access was passed'
        })
    },
    getNoAccessToken: function(req, res) {
        res.json({
            code: 0,
            msg: 'access was passed'
        })
    }
}