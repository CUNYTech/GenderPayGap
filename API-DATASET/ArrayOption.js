var areaName = 'New York';
var occupationName = 'Computer Programmer';
var occupationNum = '151131)';
var areaNum = '3600000)';
var seriesNum = 'OEUS360000000000015113111';

    //"http://api.dol.gov/V1/WHPS/?KEY=1ce7650d-b131-4fb7-91b3-b7761efc8cd4";
    //source: http://stackoverflow.com/questions/17811827/get-a-json-via-http-request-in-nodej
var realmStatus = ["http://api.dol.gov/V1/Statistics/OES/OE_OCCUPATION/?KEY=1ce7650d-b131-4fb7-91b3-b7761efc8cd4&$filter=OCCUPATION_NAME eq ", + occupationName + "http://api.dol.gov/V1/Statistics/OES/OE_AREA/?KEY=1ce7650d-b131-4fb7-91b3-b7761efc8cd4&$filter=AREA_NAME eq ", + areaName + "http://api.dol.gov/V1/Statistics/OES/OE_SERIES/?KEY=1ce7650d-b131-4fb7-91b3-b7761efc8cd4&$filter=(OCCUPATION_CODE eq ", + occupationNum + "and (AREA_CODE eq " + areaNum + "http://api.dol.gov/V1/Statistics/OES/OE_DATA_PUB/?KEY=12da81cd-467e-46ff-b039-5aa5833bb573&$filter=SERIES_ID eq " + seriesNum];
var encode = encodeURI(realmStatus);


for(i = 0; i<encode.length; i++){

var http = require("http");

var options = {
        host: 'api.dol.gov',
        path: encode[i],
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
}