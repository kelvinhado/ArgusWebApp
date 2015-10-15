var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

// If you have an error related to express, request or cheerio, just type on the terminal $ npm install XX (express,request,cheerio).
// Things to fix, special character and empty space.

app.get('/scrape', function(req, res){

  url = 'http://www.leboncoin.fr/voitures/852693116.htm?ca=12_s';

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            var title, postCode, brand, model, energy, year, kilometers, gearbox, description, price;
            var json = { title :"", postCode:"", brand:"", model:"", energy:"", year:"", kilometers:"", gearbox:"", description:"", price:""} // This is where we define our .json

            var tablbc =[];
            var tab = [];


            $('.floatLeft tr').each(function(){ // You use .each to do a loop
              var k = $('th',this).text();  // value in each th tag
              var v = $('td', this).text(); // value in each td tag
              tab.push(v);
            })

            $('.content').filter(function(){ // You use .filter to check on one tag
              json.description = $(this).text();
            })

            $('.header_adview').filter(function(){
              json.title = $(this).text();
            })


            $('.lbcParams.criterias td').each(function(){ //Between lbcParams and criteria, there should be an empty space but we need to put a . otherwise it will think that criteria is another tag to check.
              var v = $(this).text();
              tablbc.push(v);
            })

            json.price = tab[0];
            json.postCode = tab[2];

            json.brand = tablbc[0];
            json.model = tablbc[1];
            json.year = tablbc[2];
            json.kilometers = tablbc[3];
            json.energy = tablbc[4];
            json.gearbox = tablbc[5];

        }

fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){

    console.log('File successfully written! - Check your project directory for the output.json file');

})

res.send('Check your console!')
    });
})

// After debugging the code you will have to go to "http://localhost:8081/scrape" a file output.json will be created in your directory.

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
