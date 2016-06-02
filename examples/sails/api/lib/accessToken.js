var accessTokenApi = require('access-token-api');
var TokenApi = new accessTokenApi({
    webTokenVarName: 'encrypt_api_tokenStr', //default to encrypt_api_tokenStr
});
module.exports = TokenApi;