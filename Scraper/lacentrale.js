var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');

// Json Prototype
// var jsonTEST = {
//     "title": "Citro�n C4 HDi 110 Rossignol GPS 1ere main",
//     "postCode": "91140",
//     "brand": "Peugeot",
//     "model": "307",
//     "energy": "Diesel",
//     "year": "2005",
//     "kilometers": "57126",
//     "gearbox": "Manuelle",
//     "description": "Citro�n C4 HDi 110 Rossignol GPS 1ere main berline, noir, 6 cv, 5 portes, mise en circulation le 20/02/2012, premi�re main, garantie 6 mois.5 placesOPTIONS ET EQUIPEMENTS :Ext�rieur :- vitres �lectriques- jantes alliageInt�rieur et confort :- volant r�glable- bluetooth- si�ges r�glables en hauteur- volant cuir- climatisation automatique- GPSS�curit� :- direction assist�e- fermeture centralis�e- ABS- ESP- phares antibrouillard- radar arri�re de d�tection d'obstacles- r�gulateur de vitesseAutres �quipements et informations :kilom�trage garanti, vitres avant �l�ctriques, roue de secours, airbag conducteur, Accoudoir avant, Airbag lat�ral conducteur et passager, Airbag passager, Assistance de freinage, Banquette arri�re partag�e et rabattable, Becquet arri�re, Contr�le de traction, Lecteur MP3, Radio, R�troviseurs ext�rieurs rabattable �lectriquement, R�troviseurs ext�rieurs �lectriques, Si�ge conducteur � r�glage lombaire, Si�ge passager r�glable en hauteur, Si�ge passager � r�glage lombaire, Si�ges en tissu, T�l�phone portable, Vitres arri�re surteint�es, Vehicule  1ere main r�vis� et garanti 6 mois . Extension de garantie possible de 6 a 24 mois .ENTRETIEN CITROEN . Financement possible.  Dispo selon arrivage renault megane ford focus audi a3 golf 5 golf 6 peugeot 308 opel astraR�f�rence annonce : 310VO001456NOUS CONTACTER :0630563468",
//     "price": "11 990 €"
// };

var baseUrl = "http://www.lacentrale.fr/cote-voitures";

exports.fetchArgus = function(json, callback) {

  //TODO : Check valid arguments (ex model : "autres") to catch

  // build request url using json
  var url = baseUrl;
      url += "-" + (json['brand']);
      url += "-" + (json['model']);
      url += "--" + (json['year']);
      url += "-.html";
  // // ** for debug
  //   console.log('LC_log // url : ' + url);
  // ** end debug

    var brand, model, year, energy, gearbox, title, price;
    var sub_url;
    var json = JSON.parse(jsonstring)
    var resultLength;
    price = json.price;
    brand = json.brand;
    model = json.model;
    year = json.year;
    gearbox = json.gearbox;
    energy = json.energy;
    title = json.title;


  var result_json = {average: 0, total: 0, low: 0, dis: ""};
  request(url, function(error, reponse, html){

    if(!error){
      var $ = cheerio.load(html);
      resultLength = $('.tdSD.QuotMarque').length;

      var en, gbox;
      var priceArray = new Array();
      var t = 0;
      var h = 0;
      async.forEachOf($('.tdSD.QuotMarque'), function(value, key, callback){
        t++;
        var each_data = $(value);
        var en = (each_data.siblings(".tdSD.QuotNrj").text()).replace(/^\s+|\s+$/g,'');
        var gbox = (each_data.siblings(".tdSD.QuotBoite").text()).replace(/^\s+|\s+$/g,'');

        en = en.toLowerCase();
        energy = energy.toLowerCase();
        var index = en.indexOf(energy);

        if((index !== -1 || energy.toLowerCase() === "autre"|| energy.toLowerCase() === "autres") && (gbox.toLowerCase() === gearbox.toLowerCase())) {

                                  sub_url = "http://www.lacentrale.fr/" + each_data.find("a").attr("href");

                                  request(sub_options, function(error, response, html) {     // two parameters: an URL and a callback
                                    if(!error) {

                                          var $ = cheerio.load(html);
                                          priceArray[h] = ($(".Result_Cote.arial.tx20").text()).replace(/[^0-9]/ig,"");
                                          h++;
                                          callback();
                                              }
                                          });
                          }else {
                                    callback();
                            }

                    // Handle result after all the prices of the records are recorded
                    }, function(err){

                        if( err ) {
                            console.log('Error happend!');
                            myCallback("no result");
                        } else {

                            console.log(url);
                            console.log("Total records: " + t + ", effective record: " + h);

                            if(priceArray.length !== 0){

                                result_json.total = priceArray.length;

                                for(var i=0; i<priceArray.length; i++){

                                    result_json.average += (priceArray[i] / priceArray.length);

                                    if(priceArray[i] > prix) {

                                        result_json.low++;

                                    }

                                }

                                result_json.average = Math.round(result_json.average);

                                result_json.dis = marque + "-" + modele + "--" + annee_modele;

                                console.log("---There is 'la cote Argus' for this car------");

                                myCallback(result_json);

                            }else {

                                result_json.total = 0;

                                result_json.average = 0;

                                result_json.low = 0;

                                result_json.dis = marque + "-" + modele + "--" + annee_modele;

                                console.log("---no argus' for this car------");

                                myCallback(result_json);

                            }

                        }

                    });

                }

        });


  callback(url);
}; // end export
