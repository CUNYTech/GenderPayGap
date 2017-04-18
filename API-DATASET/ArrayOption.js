var areaCodes = ["'0071950')", "'0072850')", "'0073450')", "'0075700')", "'0076450')", "'0078700')", "'0900001')", "'0900000')"];
var results = [];

    //"http://api.dol.gov/V1/WHPS/?KEY=1ce7650d-b131-4fb7-91b3-b7761efc8cd4";
    //source: http://stackoverflow.com/questions/17811827/get-a-json-via-http-request-in-nodej
for(var i = 0; i < areaCodes.length; i++){
var realmStatus = "http://api.dol.gov/V1/Statistics/OES/OE_SERIES/?KEY=1ce7650d-b131-4fb7-91b3-b7761efc8cd4&$filter=(OCCUPATION_CODE eq '151131' ) and (AREA_CODE eq " + areaCodes[i];
var encode = encodeURI(realmStatus);
        console.log("iterator: " + i);
        console.log(encode);

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
                 var dataA = JSON.parse(str);
                //run a for loop 
                //source: http://stackoverflow.com/questions/8449659/parsing-json-array-nodejs
                for(var h = 0; h < dataA.d.results.length; h++){
                    var seriesNum = dataA.d.results[h].SERIES_ID; //<--- data.d[i].series_id (THE FOURTH SERIES ID # REPRESENTS ANNUAL MEAN WAGE)
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
x.end();
}//end for loop