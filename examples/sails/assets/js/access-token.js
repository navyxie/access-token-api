$(function() {
    $('#getData').click(function() {
        $.ajax({
            url: '/api/access-token/get',
            type: 'get',
            dataType: 'json',
            data: {
                _accessToken: window.encrypt_api_tokenStr // will be verify in server
            },
            success: function(data) {
                $('#msg').html(data.msg)
                if (data.code === 0) {
                    var count = $('#count').html();
                    $('#count').html(parseInt(count) - 1);
                } else {
                    alert(data.msg)
                }
            }
        })
    })
})