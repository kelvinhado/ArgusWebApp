var http = require('http');
var url = require('url');
var io = require('socket.io');
var querystring = require('querystring');
var leboncoin = require("./leboncoin");
var lacentrale = require("./lacentrale");

/*
 *  SERVER NODE JS
 *  run this file and open your browser : localhost:7070/argus?flag=<number>
 */


var server = http.createServer(function(req, res) {
  var page = url.parse(req.url).pathname;
    console.log(page);
    res.writeHead(200, {"Content-Type": "text/plain"});
    if (page == '/') {
        res.write('To use the server, follow the link : localhost:7070/argus?flag=868496177 \n For example : for http://www.leboncoin.fr/voitures/865394106.htm?ca=12_s, the flag will be : 865394106');
    }
    else if (page == '/argus') {
        // get the parameters in the url
        var params = querystring.parse(url.parse(req.url).query);
        if('flag' in params) {

            // use our leboncoin module :
            leboncoin.getJson(params['flag'],function(jsonResult){
              // that code will be executed when the getJson is done :
                console.log("SERV_log // OK ! -> " + jsonResult['model'] + " (" + jsonResult['kilometers'] + ")");
              // use our lacentrale module :
              lacentrale.fetchArgus(jsonResult, function(argusResult) {
                 console.log("SERV_log // OK ! -> " + argusResult);
              });

              res.write("json generated with leboncoin module" + jsonResult['model']);
              res.end();

            });
              // res.write("json generated with leboncoin module" + json);


            // when json is loaded from lbc module :

            // page de test
            // res.write("\n testing lacentrale");
            // var argus = lacentrale.fetchArgus(json);
            // res.write("\n url : " + argus);
          }
        else {
            res.write('please add the "flag" parameter to the url');
            res.end();
        }
    }
});
server.listen(7070);



io.listen(server);
