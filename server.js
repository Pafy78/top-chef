var http = require('http');
var michelin = require('./michelin');
var lafourchette = require('./lafourchette');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

const express = require('express');

const app = express();
const port = process.env.PORT || 5000;


function GetMichelin(){
  var details = [];
  var count = 0;
  console.log('Loading details michelin restaurants !');
  for(i = 1; i <= 35; i++){ // 35 pages
    michelin.GetAllRestaurant(i, function(detail){
      details.push(detail);
      count ++;
      console.log(count + "/615");
      if(count >= 615){
        fs.writeFile('michelin.json', JSON.stringify(details), 'utf8');
        console.log('File created !');
      }
    });
  }
}
//GetMichelin();

function GetMichelinDetails(){
  var details = [];
  var count = 0;
  console.log('Loading details michelin restaurants !');
  michelin.GetData("content_url", function(urls) {
    urls.forEach(function(url){
      michelin.GetRestaurantDetail(url, function(detail){
        details.push(detail);
        count ++;
        console.log(count + "/615");
        if(count >= 615){
          fs.writeFile('michelin_details.json', JSON.stringify(details), 'utf8');
          console.log('File created !');
        }
      });
    });
  });
}
//GetMichelinDetails();

function GetLafourchetteURL(){
  var details = [];
  var count = 0;
  console.log('Loading details michelin restaurants !');
  michelin.GetRestaurantDetailFromLocal(function(restaurants) {
    restaurants.forEach(function(restaurant){
      lafourchette.GetRestaurantByTitle(restaurant, function(detail){
        if(detail != false){
          details.push(detail);
          count ++;
          console.log(count + "/?");
        }
      });
    });
  });
  setTimeout(function() {
    fs.writeFile('lafourchette_details.json', JSON.stringify(details), 'utf8');
    console.log('File created !');
  }, 60000); // Adjust delay for loading all
}
//GetLafourchetteURL();


function jsonConcat(o1, o2) {
  for (var key in o2) {
    o1[key] = o2[key];
  }
  return o1;
}

app.get('/top-chef', (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  var resto = [];
  lafourchette.GetPromotion(function(restaurant, offer, menu, end){
    if(offer){
      var concat = {};
      menu.promotion = menu.title; // because title exist in restaurant and menu
      concat = jsonConcat(concat, menu);
      concat = jsonConcat(concat, restaurant);
      resto.push(concat);
    }
    if(end){
      res.send(resto);
    }
  });
  //res.send({ express: 'Hello From Express' });
});


app.listen(port, () => console.log(`Listening on port ${port}`));
