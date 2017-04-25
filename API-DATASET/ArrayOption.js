var http = require("http");
var areaCodes = ['0013740', '0024500', '0033540', '3000001', '3000002', '3000003', '3000004'];


var encode = [];

//"http://api.dol.gov/V1/WHPS/?KEY=1ce7650d-b131-4fb7-91b3-b7761efc8cd4";
//source: http://stackoverflow.com/questions/17811827/get-a-json-via-http-request-in-nodej
for (var i = 0; i < areaCodes.length; i++) {
    var realmStatus = "http://api.dol.gov/V1/Statistics/OES/OE_DATA_PUB/?KEY=1ce7650d-b131-4fb7-91b3-b7761efc8cd4&$filter=SERIES_ID eq " + "'OEUM" + areaCodes[i] + "000000" + '151131' + "04'";
    encode.push(encodeURI(realmStatus));
    console.log("iterator: " + i);
    console.log("endpoint encoded: " + encode[i]);


    var options = {
        host: 'api.dol.gov',
        path: encode[i],
        type: 'GET',
        dataType: 'json',
        headers: {
            'accept': 'application/json'
        }
    };
    console.log("Start");
    var x = http.request(options, function(res) {
        console.log("Connected");
        var str = '';
        res.on('data', function(chunk) {
            str += chunk;
        });
        res.on('data', function(data) {
            //source: http://stackoverflow.com/questions/28503493/parsing-json-array-inside-a-json-object-in-node-js
            if (res.statusCode == 200) {
                try {
                    var data = JSON.parse(str);
                    var state = data.d.results[0].VALUE; //fixed small bug here(for some reason, sometimes its data.d.result[0].AREA_CODE, sometimes its data.d[0].AREA_CODE);
                    console.log(state);
                } catch (e) {
                    //console.log('Error parsing JSON');
                }
            }
            //console.log(data.toString());
        });
    });
    x.end();
} //end for loop
