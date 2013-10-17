/*
function getTwitterAuthorizeTokens() { 
    return {
        oauth_token: "15854229-iTEQDEixW4JLltrgr4EB9vYY75RNag4CsjC9er0SC", 
        oauth_token_secret: "iEyRUAdxp7UFXx7uIAlFRATl39KnSCCp472nTVtxhrI"
    };
}

// Get the consumer key and secret
function getTwitterConsumerTokens() {
    return {
        key: "YWkWeFaQRGRybI0NYNrYiw", 
        secret: "1X7sroA9I3rRPzBT69cnnWIhKNeBUf4bGwF8CzTE"
    };
}
var s = encodeURIComponent(getTwitterConsumerTokens().key,'RFC 1738');
s += ':'+encodeURIComponent(getTwitterConsumerTokens().secret,'RFC 1738');
console.log('s: ' + s);
var sB64 = btoa(s);
console.log('sB64: ' + sB64);

$( document ).ready(function(){
    $.ajax({
            type:"POST",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", "Basic " + sB64);
                request.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
            },
            url: "https://api.twitter.com/oauth2/token",
            data: "grant_type=client_credentials",
            processData: false,
            success: function(msg) {
                alert("successfull");
                console.log('msg: ' + msg);
            }
    });
});
*/