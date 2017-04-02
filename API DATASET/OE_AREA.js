var realmStatus = "http://api.dol.gov/V1/Statistics/OES/OE_AREA/?KEY=1ce7650d-b131-4fb7-91b3-b7761efc8cd4&$filter=AREA_CODE eq ";
var userInput = "'5100000'"; //temporary example
realmStatus = realmStatus.concat(userInput);
var encode = encodeURI(realmStatus);

    //"http://api.dol.gov/V1/WHPS/?KEY=1ce7650d-b131-4fb7-91b3-b7761efc8cd4";
    //source: http://stackoverflow.com/questions/17811827/get-a-json-via-http-request-in-nodejs
    //TypeError: Request path contains unescaped characters --> solution: https://www.w3schools.com/jsref/jsref_encodeuri.asp

var http = require("http");

var options = {
        host: 'api.dol.gov',
        path: encode,
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