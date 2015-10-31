var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    leboncoin = require("./leboncoin"),
    lacentrale = require("./lacentrale"),
    express = require('express'),
    cheerio = require('cheerio'),
    app = express(),
    path = require('path'),
    bodyParser = require('body-parser');

app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/views', 'index.html'));
 });

app.post('/', function(req, res) {

      var url = req.body.lbc_url;

      // running leboncoin module
      leboncoin.getJson(url,function(lbc_jsonResult){
        console.log("SERV_log // lbc_module -> done");
        // running lacentrale module when lbc is done
        lacentrale.fetchArgus(lbc_jsonResult, function(rows_result) {
            // show result in the table display
            fs.readFile('./views/results.html','utf8', function (err, html) {
                  if (err) {
                      throw err;
                  }
                  else {
                     res.contentType('text/html');
                     $ = cheerio.load(html);
                      for(var i = 0 ; i < rows_result.length; i++) {
                      //  console.log(rows_result[i].version + " || " +  rows_result[i].argus + " || " + rows_result[i].good_deal);
                            var row = "<tr>";
                            row += "<td>"+rows_result[i].version+"</td>";
                            row += "<td>"+rows_result[i].argus+"</td>";
                            row += "<td>"+rows_result[i].good_deal+"</td>";
                            row += "</tr>";
                            $('tbody').append(row);
                          }
                  res.send($.html());

                  } // *end* else
            }); // *end* fs readfile
          }); // *end* lacentrale fetch argus
      }); // *end* leboncoin get json

 });


 var server = app.listen(9292, function () {
         var host = server.address().address;
         var port = server.address().port;
         console.log('App is listening at http://%s:%s', host, port);

 });
