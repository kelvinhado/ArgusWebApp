var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

/*
 *  LEBONCOIN MODULE
 */


// we export the function so that we can use it outside by using leboncoin.getJson(flag).
// this function will be executed only when called from our server.
exports.getJson = function(url, callback) {


 var req = request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            var title, postCode, brand, model, energy, year, kilometers, gearbox, description, price;
            var json = { title :"", postCode:"", brand:"", model:"", energy:"", year:"", kilometers:"", gearbox:"", description:"", price:""}; // This is where we define our .json

            var tablbc =[];
            var tab = [];


            $('.floatLeft tr').each(function(){ // You use .each to do a loop
              var k = $('th',this).text();  // value in each th tag
              var v = $('td', this).text(); // value in each td tag
              tab.push(v);
            });

            $('.content').filter(function(){ // You use .filter to check on one tag
              json.description = cleanField($(this).text());
            });

            $('.header_adview').filter(function(){
              json.title = cleanField($(this).text());
            });


            $('.lbcParams.criterias td').each(function(){ //Between lbcParams and criteria, there should be an empty space but we need to put a . otherwise it will think that criteria is another tag to check.
              var v = $(this).text();
              tablbc.push(v);
            });

            json.price = (cleanField(tab[0]).replace("€", "")).replace(/ /g,'');
            json.postCode = tab[2];

            json.brand = tablbc[0];
            json.model = tablbc[1];
            json.year = cleanField(tablbc[2]);
            json.kilometers = tablbc[3].replace(/[KM]| /g, "");
            json.energy = tablbc[4];
            json.gearbox = tablbc[5];
            callback(json);
        }


}); // end request
}; // end exports.getJson



function cleanField(text) {
    // we replace all "\n" to blank space
    var step1 = text.replace(/(\r\n|\n|\r)/gm," ");
    // we replace extra blank space and return the results
    return  step1.replace(/^\s+|\s+$/g, "");
}
