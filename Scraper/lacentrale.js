var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var random_useragent = require('random-useragent');


// Settings
var denom_lbc_gearbox_mecanique = "manuelle";
var denom_lc_gearbox_mecanique = "mécanique";
//

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


exports.fetchArgus = function(json, exportCallback) {



  // initialize json informations from lbc
  var lbc_title = (json['title']).toLowerCase();
  var lbc_brand = (json['brand']).toLowerCase();
  var lbc_model = (json['model']).toLowerCase();
  var lbc_energy = (json['energy']).toLowerCase();
  var lbc_year = json['year'];
  var lbc_kilometers = json['kilometers'];
  var lbc_gearbox = (json['gearbox']).toLowerCase();
  var lbc_description = json['description'];
  var lbc_price = json['price'];


  console.log("LC_log // receive : " + lbc_title + "|" + lbc_gearbox + "|" + lbc_energy);
  // build request url using json
  var url = baseUrl;
      url += "-" + lbc_brand;
      url += "-" + lbc_model;
      url += "--" + lbc_year;
      url += "-.html";
  // ** for debug
  console.log('LC_log // url : ' + url);
  // ** end debug

  // size of the array scrapped in 'lacentrale'
  var lc_resultsLength;

  // initialize json informations result that will be send to the server
  var result_json = {
  };


  request(url, function(error, reponse, html){

    if(!error){
      var $ = cheerio.load(html); // loading html page
      lc_resultsLength = $('.tdSD.QuotMarque').length;

      // we will scrapp informations from every items in the list
      var nomberOfVersion = 0;
      var firstMatch = false;

        // WARNING we will work only with the first result for now but we will still use forEach for next improvment

        // for each item of tdSD
        async.forEachOf($('.tdSD.QuotMarque'), function(value, key, callback) {
              nomberOfVersion++;

              var current_car_version     = $(value);
              var current_car_energy      = (current_car_version.siblings(".tdSD.QuotNrj").text()).replace(/^\s+|\s+$/g,'');
              var current_car_gearbox     = (current_car_version.siblings(".tdSD.QuotBoite").text()).replace(/^\s+|\s+$/g,'');
              current_car_energy = current_car_energy.toLowerCase();
              current_car_gearbox = current_car_gearbox.toLowerCase();
              if(lbc_gearbox === denom_lbc_gearbox_mecanique) {
                lbc_gearbox = denom_lc_gearbox_mecanique;
              }

            //TODO : Check valid arguments (ex model : "autres") to catch
              //if(current_car_energy === lbc_energy && current_car_gearbox === lbc_gearbox) {
              if(current_car_gearbox === lbc_gearbox) { // for now we just check gearbox

                if(firstMatch === false) {
                  // building cote url
                  var cote_url = "http://www.lacentrale.fr/" + current_car_version.find("a").attr("href");
                  console.log("LC_log // " + cote_url);

                  // gets a random user agent string
                  // var user_agent = random_useragent.getRandom();
                  // // Set the headers
                  // var headers = {
                  //     'User-Agent':        user_agent,
                  //     'Content-Type':     'application/x-www-form-urlencoded'
                  // }
                  // // request
                  // cote_opt = {
                  //     url: cote_url,
                  //     method: 'GET',
                  //     headers: headers
                  // }
                  request(cote_url, function(error, response, html) {     // two parameters: an URL and a callback

                      if(!error) {
                          var $ = cheerio.load(html);
                          var argus = ($(".Result_Cote.arial.tx20").text()).replace(/[^0-9]/ig,"");
                          console.log(argus);
                          exportCallback(argus);
                          callback(); // break asyncForEach, go next
                      }

                  });


                  firstMatch = true;
                }// end temp FirstMAtch

              } // end if test match
              else {
                //console.log("unmatch : " + current_car_energy + " <> " + current_car_gearbox);
                callback(); // goToNext if no match
              }

        } // when loop done
        , function(err){
            if(err) {
              console.log("004 - can't get any results");
               exportCallback("004 - can't get any results");
            }
            else {
               // ALL OK
              console.log(priceArray[0]);

               // TODO Work here with result end send the json result here
            }

        }
      ); // end asyncForEach

    } // end if(!error)

}); // end request


} // end export method
