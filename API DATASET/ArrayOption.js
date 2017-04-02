



    //"http://api.dol.gov/V1/WHPS/?KEY=1ce7650d-b131-4fb7-91b3-b7761efc8cd4";
    //source: http://stackoverflow.com/questions/17811827/get-a-json-via-http-request-in-nodej
var realmStatus = ["http://api.dol.gov/V1/Statistics/OES/OE_OCCUPATION/?KEY=1ce7650d-b131-4fb7-91b3-b7761efc8cd4&$select=OCCUPATION_CODE,OCCUPATION_NAME","http://api.dol.gov/V1/Statistics/OES/OE_INDUSTRY/?KEY=1ce7650d-b131-4fb7-91b3-b7761efc8cd4&$select=INDUSTRY_CODE,INDUSTRY_NAME","http://api.dol.gov/V1/Statistics/OES/OE_AREATYPE/?KEY=1ce7650d-b131-4fb7-91b3-b7761efc8cd4&$select=AREATYPE_CODE,AREATYPE_NAME","http://api.dol.gov/V1/Statistics/OES/OE_SERIES/?KEY=1ce7650d-b131-4fb7-91b3-b7761efc8cd4&$select=SERIES_ID,AREA_CODE,INDUSTRY_CODE,OCCUPATION_CODE","http://api.dol.gov/V1/Statistics/OES/OE_AREA/?KEY=1ce7650d-b131-4fb7-91b3-b7761efc8cd4&$select=AREA_CODE,AREATYPE_CODE,AREA_NAME","http://api.dol.gov/V1/Statistics/OES/OE_DATA_PUB/?KEY=12da81cd-467e-46ff-b039-5aa5833bb573&$select=SERIES_ID,YEAR,PERIOD,VALUE"];


for(i = 0; i<realmStatus.length; i++){

var http = require("http");

var options = {
        host: 'api.dol.gov',
        path: realmStatus[i],
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