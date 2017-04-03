var realmStatus = "http://api.dol.gov/V1/Statistics/OES/OE_SERIES/?KEY=1ce7650d-b131-4fb7-91b3-b7761efc8cd4&$filter=(OCCUPATION_CODE eq '151131') and (AREA_CODE eq '3600000')";
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
        if(res.statusCode == 200){
            try{
                var data = JSON.parse(str);
                var seriesNum = data.d.results[0].SERIES_ID;
                array.push(seriesNum);
                console.log(seriesNum);
            }catch(e){
                console.log('Error parsing JSON');
            }
        }
    });
});
exports.getArea = function(seriesID){
    return array[seriesID];
    console.log('Returning occupation code');
}
x.end();