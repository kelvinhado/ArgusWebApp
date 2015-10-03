var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

// si jamais on vous dit qu'il express, request ou cheerio, faire $ npm install XX
// quand on lance le code, faudra aller sur "http://localhost:8081/scrape" et un fichier output.json sera créé dans le dossier, j'ai mis celui qu'on pour le moment dans le git
// le truc arrive pas à retourner les char spéciaux, style "é", et quelque fois retourn des \n (quand y'a du style j'ai l'impression), on peut s'en débarasser avec un search \n et replace par du vide

app.get('/scrape', function(req, res){

  url = 'http://www.leboncoin.fr/voitures/852693116.htm?ca=12_s';

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            var title, postCode, brand, model, energy, kilometers, gearbox, description, price;
            var json = { title :"", postCode:"", brand:"", model:"", energy:"", kilometers:"", gearbox:"", description:"", price:""} // de ce que j'ai compris, c'est ici que le format du json est défini, au début je pensais que ça suivrait package.json


            var tablbc =[]; //j'ai créé 2 tab pour le moment car je suis mauvais
            var tab = []; //je pense on peut avoir qu'une tab, et rendre le retour des résultats plus dynamique

            $('.floatLeft tr').each(function(){ //le .each fait une sorte de foreach tr dans .floatLeft
              var k = $('th',this).text();  // valeur dans le th, par exemple "Marque :" (useless mais c'bien de savoir, bitch)
              var v = $('td', this).text(); // la valeur dans le td, donc ce qu'on veut
              tab.push(v);


            })

            $('.content').filter(function(){ //si on fait pas de .each, alors c'est .filter
              json.description = $(this).text();
            })

            $('.header_adview').filter(function(){
              json.title = $(this).text();
            })


            $('.lbcParams.criterias tr').each(function(){ //normalement il y a un espace entre lbcParams et criterias mais il faut mettre un ".", en mettant un espace on précise une autre balise, ici tr (je suppose)


              var v = $('td',this).text();
              tablbc.push(v);
            })
            //du coup plein de tab c'est cheum
            json.price = tab[0];
            json.postCode = tab[2];
            json.brand = tablbc[0];
            json.model = tablbc[1];
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

app.listen('8081')
console.log('Magic happens on port 8081');
exports = module.exports = app;
