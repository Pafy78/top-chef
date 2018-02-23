var http = require('http');
var michelin = require('./michelin');
var lafourchette = require('./lafourchette');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');


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

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    lafourchette.GetPromotion(function(url){
        res.write(url);
        res.write("<br/>");
    })
    res.end();

}).listen(8888);