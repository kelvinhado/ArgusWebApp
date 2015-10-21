var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var logTable = require('tty-table');

var random_useragent = require('random-useragent');


// Settings
var denom_lbc_gearbox_mecanique = "manuelle";
var denom_lc_gearbox_mecanique = "mécanique";
var baseUrl = "http://www.lacentrale.fr/cote-voitures";
//

// for easy display
var header = [
    {
        value : "version",
        headerColor : "cyan",
        color: "yellow",
        align : "left",
        paddingLeft : 1,
        width : 30
    },
    {
        value : "argus",
        headerColor : "cyan",
        color : "yellow",
        width : 30
    },
    {
        value : "good_deal",
        headerColor : "cyan",
        color : "yellow",
        width : 30
    }
];
var rows_result = [];


exports.fetchArgus = function(json, exportCallback) {



  // initialize json informations from lbc
  var lbc_title = json.title.toLowerCase();
  var lbc_brand = json.brand.toLowerCase();
  var lbc_model = json.model.toLowerCase();
  var lbc_energy = json.energy.toLowerCase();
  var lbc_year = json.year;
  var lbc_kilometers = json.kilometers;
  var lbc_gearbox = json.gearbox.toLowerCase();
  var lbc_description = json.description;
  var lbc_price = json.price;

  console.log("LC_log // receive : " + lbc_title + "|" + lbc_gearbox + "|" + lbc_energy + "|" + lbc_price);
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


  request(url, function(error, reponse, html){

    if(!error){
      var $ = cheerio.load(html); // loading html page
      lc_resultsLength = $('.tdSD.QuotMarque').length;

      // we will scrapp informations from every items in the list
      var nomberOfVersion = 0;


        // for each item of tdSD
        async.forEachOf($('.tdSD.QuotMarque'), function(value, key, callback) {
              nomberOfVersion++;

              var current_car_version     = $(value);
              var current_car_energy      = ((current_car_version.siblings(".tdSD.QuotNrj").text()).replace(/^\s+|\s+$/g,'')).toLowerCase();
              var current_car_gearbox     = ((current_car_version.siblings(".tdSD.QuotBoite").text()).replace(/^\s+|\s+$/g,'')).toLowerCase();
              var current_car_title =  current_car_version.find("a").text();

              // Ajusting data from lbc json
                if(lbc_gearbox === denom_lbc_gearbox_mecanique) {
                  lbc_gearbox = denom_lc_gearbox_mecanique;
                }




              //** we directly try to extract the price from the <!-- tdSD QuotPrice --> available in the current page so that we do not have to do an other request to fetch it
              // var div = $("*").html(current_car_version),
              //   comment = div.contents().filter(function() {
              //       return this.nodeType === 8;
              //   }).get(0);
              // console.log(comment.nodeValue);
              //** (not working for now)

              //TODO : Check valid arguments (ex model : "autres") to catch
              //if((current_car_energy.indexOf(lbc_energy)>-1) && (current_car_gearbox === lbc_gearbox) && (count_match > 0)) {
              if(((current_car_energy.indexOf(lbc_energy)>-1) && (current_car_gearbox === lbc_gearbox)) || lbc_energy === "autre"|| lbc_energy === "autres") {

                  // building cote url
                  var cote_url = "http://www.lacentrale.fr/" + current_car_version.find("a").attr("href");


                  //TODO Hundle too many connexion at the same time
                  request(cote_url, function(error, response, html) {
                      if(!error) {
                          var $ = cheerio.load(html);
                          var argus = ($(".Result_Cote.arial.tx20").text()).replace(/[^0-9]/ig,"");
                          //console.log(cote_title_href + " > " + argus + "€");
                          //exportCallback(argus);
                          var argus_txt = argus + " €";
                          var deal = "";
                          if(parseInt(argus, 10) > parseInt(lbc_price, 10)) {
                            deal = "good deal";
                          }
                          else {
                            deal = "bad deal";
                          }


                          var new_row = { version : current_car_title,
                                          argus : argus_txt,
                                          good_deal : deal };
                          rows_result.push(new_row);
                          callback(); // break asyncForEach, go next
                      }

                  });

              } // end if test match
              else {
                //console.log("unmatch : " + current_car_energy + " <> " + current_car_gearbox);
                callback(); // goToNext if no match
              }

        }, function(err){
            if(err) {
              console.log("004 - can't get any results");
               exportCallback("004 - can't get any results");
            }
            else {
               // ALL OK

               var t2 = logTable(header,rows_result,{
                  borderStyle : 2,
                  paddingBottom : 0,
                  headerAlign : "center",
                  align : "center",
                  color : "green"
              });

              var str2 = t2.render();
              console.log(str2);
              exportCallback(rows_result);
               // TODO Work here with result end send the json result here
            }

        }
      ); // end asyncForEach

    } // end if(!error)

}); // end request


} // end export method




// function to count match in both title strings in lacentrale and leboncoin title
function count_match(lbc_title, lbc_brand, lbc_model, lc_string) {
    //lbc
    lbc_title = lbc_title.replace(lbc_brand,'');
    lbc_title = lbc_title.replace(lbc_model,'');
    var lbc_array = lbc_title.split(" ");
    //lc
    lc_string = lc_string.toLowerCase();
    var lc_array = lc_string.split(" ");

    var numberOfMatch = 0;

    for (var i = 0; i < lbc_array.length; i++) {
      for (var y = 0; y < lc_array.length; y++) {
         if(lbc_array[i] == lc_array[y]) {
           numberOfMatch++;
         }
      }
    }

    return numberOfMatch;

}
