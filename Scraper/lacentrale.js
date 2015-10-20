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

                  // building cote url
                  var cote_url = "http://www.lacentrale.fr/" + current_car_version.find("a").attr("href");

                  var cote_title_href =  current_car_version.find("a").attr("href");
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
                          console.log(cote_title_href + " > " + argus + "€");
                          exportCallback(argus);
                          callback(); // break asyncForEach, go next
                      }

                  });


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
              console.log("finish :)");

               // TODO Work here with result end send the json result here
            }

        }
      ); // end asyncForEach

    } // end if(!error)

}); // end request


} // end export method
