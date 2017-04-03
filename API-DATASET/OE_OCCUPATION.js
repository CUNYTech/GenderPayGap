var realmStatus = "http://api.dol.gov/V1/Statistics/OES/OE_OCCUPATION/?KEY=1ce7650d-b131-4fb7-91b3-b7761efc8cd4&$filter=OCCUPATION_NAME eq ";
var userInput = "'Computer Programmers'"; //Based on user input.
realmStatus = realmStatus.concat(userInput);
var encode = encodeURI(realmStatus);
var array = [];
    //"http://api.dol.gov/V1/WHPS/?KEY=1ce7650d-b131-4fb7-91b3-b7761efc8cd4";
    //source: http://stackoverflow.com/questions/17811827/get-a-json-via-http-request-in-nodejs

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
     var str = '';
    res.on('data', function(chunk) {
        str += chunk;
    });
    res.on('data',function(data){
        //source: http://stackoverflow.com/questions/28503493/parsing-json-array-inside-a-json-object-in-node-js
        if(res.statusCode == 200){
            try{
                var data = JSON.parse(str);
                var state = data.d.results[0].OCCUPATION_CODE;
                array.push(state);
                console.log(state);
            }catch(e){
                console.log('Error parsing JSON');
            }
        }
    });
});
exports.getArea = function(occupationCode){
    return array[occupationCode];
    console.log('Returning occupation code');
}
x.end();