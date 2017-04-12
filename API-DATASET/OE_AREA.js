var realmStatus = "http://api.dol.gov/V1/Statistics/OES/OE_AREA/?KEY=1ce7650d-b131-4fb7-91b3-b7761efc8cd4&$filter=AREA_NAME eq ";
var userInput = "'New York'"; //temporary example (This will be based on user response to the form)

realmStatus = realmStatus.concat(userInput);
var encode = encodeURI(realmStatus);
var array = [];

//"http://api.dol.gov/V1/WHPS/?KEY=1ce7650d-b131-4fb7-91b3-b7761efc8cd4";
//source: http://stackoverflow.com/questions/17811827/get-a-json-via-http-request-in-nodejs
//TypeError: Request path contains unescaped characters --> solution: https://www.w3schools.com/jsref/jsref_encodeuri.asp

var http = require("http");

var options = {
    host: 'api.dol.gov',
    path: encode,
    type: 'GET',
    dataType: 'json',
    headers: {
        'accept': 'application/json'
    }
};


console.log("Start");
var x = http.request(options, function(res) {
    console.log("Connected");
    //source: http://stackoverflow.com/questions/11826384/calling-a-json-api-with-node-js
    var str = '';
    res.on('data', function(chunk) {
        str += chunk;
    });
    res.on('data', function(data) {
        //source: http://stackoverflow.com/questions/28503493/parsing-json-array-inside-a-json-object-in-node-js
        if (res.statusCode == 200) {
            try {
                var data = JSON.parse(str);
                var state = data.d.results[0].AREA_CODE; //fixed small bug here(for some reason, sometimes its data.d.result[0].AREA_CODE, sometimes its data.d[0].AREA_CODE);
                array.push(state);
                console.log(state);
            } catch (e) {
                console.log('Error parsing JSON');
            }
        }
        //console.log(data.toString());
    });
});
exports.getArea = function(areaCode) {
    return array[areaCode];
    console.log('Returning area code');
}
x.end();
