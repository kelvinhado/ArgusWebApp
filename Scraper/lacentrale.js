var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');

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
  // ** for debug
    console.log('LC_log // url : ' + url);
  // ** end debug


  callback(url);
}; // end export
