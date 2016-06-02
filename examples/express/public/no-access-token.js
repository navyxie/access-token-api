$(function() {
    $('#getData').click(function() {
        $.ajax({
            url: '/api/no-access-token/get',
            type: 'get',
            dataType: 'json',
            data: {
                _accessToken: window.encrypt_api_tokenStr
            },
            success: function(data) {
                $('#msg').html(data.msg)
            }
        })
    })
})