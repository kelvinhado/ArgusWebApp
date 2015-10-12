var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

// si jamais on vous dit qu'il express, request ou cheerio, faire $ npm install XX
// quand on lance le code, faudra aller sur "http://localhost:8081/scrape" et un fichier output.json sera créé dans le dossier, j'ai mis celui qu'on pour le moment dans le git
// le truc arrive pas à retourner les char spéciaux, style "é", et quelque fois retourn des \n (quand y'a du style j'ai l'impression), on peut s'en débarasser avec un search \n et replace par du vide

app.get('/scrape', function(req, res){

  url = 'http://www.lacentrale.fr/auto-occasion-annonce-28165729.html';

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            var title, brand, model, energy, year, kilometers, gearbox, price;

            var json = { title :"", brand:"", model:"", energy:"", year:"", kilometers:"", gearbox:"", price:""} // de ce que j'ai compris, c'est ici que le format du json est défini, au début je pensais que ça suivrait package.json

            var tablc =[];

            $('.titleDetail').filter(function(){
              json.title = $(this).text();

            })


            $('.priceDetail').filter(function(){

              var data = $(this);
              price = data.children().first().text();
              json.price = $(this).text();
            })


            $('.floatL.w50 p').each(function(){
              var v = $(this).text();
              tablc.push(v);
            })


            $('.hiddenOverflow p').each(function(){
              var v = $(this).text();
              tablc.push(v);
            })

            json.year = tablc[0];
            json.kilometers = tablc[1];
            json.gearbox = tablc[5];
            json.energy = tablc[19];

        

        }

        

fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){

    console.log('File successfully written! - Check your project directory for the output.json file');

})

res.send('Check your console!')
    });
})

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
