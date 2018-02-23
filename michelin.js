var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');


exports.GetAllRestaurant = function (page, callback) {
    var url = "https://restaurant.michelin.fr/restaurants/france/restaurants-1-etoile-michelin/restaurants-2-etoiles-michelin/restaurants-3-etoiles-michelin/";
    if(page > 1){
        page = "page-" + page;
    }
    else{
        page = "";
    }
    request(url + page, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body);
            $('.poi-card-link').filter(function(){
                var data = $(this);
                var detail = {
                    content_url : "https://restaurant.michelin.fr" + data.first().attr()["href"]
                }
                callback(detail);
            });

        }
    });
};

exports.GetData = function (attribute, callback) {
    fs.readFile('michelin.json', 'utf8', function (err, data) {
        if (err) throw err;
        var res = [];
        for(var attributename in JSON.parse(data)){
            res.push(JSON.parse(data)[attributename][attribute]);
        }
        callback(res);
    });
};

exports.GetRestaurantDetailFromLocal = function(callback){
    fs.readFile('michelin_details.json', 'utf8', function (err, data) {
        if (err) throw err;
        var res = [];
        for(var attributename in JSON.parse(data)){
            res.push(JSON.parse(data)[attributename]);
        }
        callback(res);
    });
};

exports.GetRestaurantDetail = function(url, callback){
    var detail = {
        title : "",
        adress : "",
        postalcode : "",
        locality : "",
        country : "",
        content_url : ""
    };
    detail.content_url = url;
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body);
            $('.street-block').filter(function(){
                var data = $(this);
                detail.adress = data.children().first().text();
            });
            $('.poi_intro-display-title').filter(function(){
                var data = $(this);
                var title = data.first().text();
                title = title.replace('\n      ','');
                title = title.replace('    ','');
                detail.title = title;
            });
            $('.postal-code').filter(function(){
                var data = $(this);
                detail.postalcode = data.first().text();
            });
            $('.locality').filter(function(){
                var data = $(this);
                detail.locality = data.first().text();
            });
            $('.country').filter(function(){
                var data = $(this);
                detail.country = data.first().text();
            });
            callback(detail);
        }
    });
}