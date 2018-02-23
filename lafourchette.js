var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');

exports.GetRestaurantByTitle = function (detail, callback) {
    var title = detail.title.replace(" ", "%20");
    request('https://www.lafourchette.com/search-refine/' + title, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body);
            var adress;
            var found = false;
            $('.resultItem-information').filter(function(){
                var data = $(this);
                if(data.children().first().next().text().includes(detail.postalcode) && !found){
                    found = true;
                    detail.fourchette_url = data.children().first().children().first().attr()["href"]
                    callback(detail);
                }
                else{
                    callback(false);
                }
            });
        }
    });
};


var GetSpecificPromo = function(restaurant, callback){
    var offer = false;
    var configuration = {
        'uri': 'https://m.lafourchette.com/api/restaurant/' + restaurant.fourchette_url.split("/")[3] + "/sale-type",
        'headers': {
            'cookie': 'datadome=AHrlqAAAAAMAF4a7sY37iSUAVvJqHA=='
        }
    };
    request(configuration, function (error, response, body) {
        if(body == undefined){
            GetSpecificPromo(restaurant, function(restaurant2, offer2, menu2){
                callback(restaurant2, offer2, menu2);
            });
        }
        if (!error && response.statusCode == 200) {
            for(var i = 0; i < JSON.parse(body).length; i++){
                var menu = JSON.parse(body)[i];
                if(menu["is_special_offer"])
                    offer = true;
            }
            callback(restaurant, offer, JSON.parse(body)[0]);
        }
    });
}

exports.GetPromotion = function(callback){
    fs.readFile('lafourchette_details.json', 'utf8', function (err, data) {
        if (err) throw err;
        var count = 0;
        var end = false;
        for(var attributename in JSON.parse(data)){
            GetSpecificPromo(JSON.parse(data)[attributename], function(restaurant, offer, menu){
                count++;
                if(count == JSON.parse(data).length)
                    end = true;
                callback(restaurant, offer, menu, end);
            });

        }
    });  
};