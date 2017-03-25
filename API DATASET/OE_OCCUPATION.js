var realmStatus = "http://api.dol.gov/V1/Statistics/OES/OE_OCCUPATION/?KEY=1ce7650d-b131-4fb7-91b3-b7761efc8cd4";

    //"http://api.dol.gov/V1/WHPS/?KEY=1ce7650d-b131-4fb7-91b3-b7761efc8cd4";
    //source: http://stackoverflow.com/questions/17811827/get-a-json-via-http-request-in-nodejs

var http = require("http");

var options = {
        host: 'api.dol.gov',
        path: realmStatus,
        type: 'GET',
        dataType: 'json',
        headers: {'accept' : 'application/json'}
    };



console.log("Start");
var x = http.request(options,function(res){
    console.log("Connected");
    res.on('data',function(data){
        console.log(data.toString()+"\n");
    });
});
x.end();