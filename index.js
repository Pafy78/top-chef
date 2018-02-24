var http = require('http');
var michelin = require('./michelin');
var lafourchette = require('./lafourchette');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

const express = require('express');

const app = express();
const port = process.env.PORT || 3000;


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


app.get('/api/hello', (req, res) => {
    lafourchette.GetPromotion(function(restaurant, offer, menu, end){
        if(offer){
            res.send(restaurant);
        }
        if(end){
            //res.end();
        }
    });
});


app.listen(port, () => console.log(`Listening on port ${port}`));

/*http.createServer(function (req, res) {
    //res.writeHead(200, {'Content-Type': 'text/html'});
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    lafourchette.GetPromotion(function(restaurant, offer, menu, end){
        if(offer){
            res.write(restaurant.title + " : " + menu["title"]);
            res.write("<br/>");
            res.write(restaurant.locality + " (" + restaurant.postalcode + ")");
            res.write("<br/>");
            res.write("<a target='_blank' href='https://www.lafourchette.com" + restaurant.fourchette_url + "'>https://www.lafourchette.com" + restaurant.fourchette_url + "</a>");
            res.write("<br/><br/>");
        }
        if(end){
            res.end();
        }
    });

}).listen(3000);*/