var realmStatus = "http://api.dol.gov/V1/Statistics/OES/OE_SERIES/?KEY=1ce7650d-b131-4fb7-91b3-b7761efc8cd4&$filter=(OCCUPATION_CODE eq '132011' ) and (AREA_CODE eq '0018880')";
                    //http://api.dol.gov/V1/Statistics/OES/OE_SERIES/?KEY=1ce7650d-b131-4fb7-91b3-b7761efc8cd4&$filter=(OCCUPATION_CODE eq '152091') and (AREA_CODE eq '0500000')

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
                 var dataA = JSON.parse(str);
                //run a for loop 
                //source: http://stackoverflow.com/questions/8449659/parsing-json-array-nodejs
                for(var i = 0; i < dataA.d.length; i++){
                    var seriesNum = dataA.d[i].SERIES_ID; //<--- data.d[i].series_id (THE FOURTH SERIES ID # REPRESENTS ANNUAL MEAN WAGE)
                    array.push(seriesNum);
                    console.log(seriesNum);
                }
                 //end for
            }catch(e){
                //console.log('Error parsing JSON');
            }
        }
        //console.log(data.toString());
    });
});
exports.getArea = function(seriesID){
    return array[seriesID];
    console.log('Returning occupation code');
}
x.end();