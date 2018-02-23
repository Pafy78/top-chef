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


var GetSpecificPromo = function(url, callback){
    var offer = false;
    var configuration = {
        'uri': 'https://m.lafourchette.com/api/restaurant/' + url.split("/")[3] + "/sale-type",
        'headers': {
            'cookie': 'datadome=AHrlqAAAAAMAF4a7sY37iSUAVvJqHA=='
        }
    };
    request(configuration, function (error, response, body) {
        if(body == undefined){
            console.log('https://m.lafourchette.com/api/restaurant/' + url.split("/")[3] + "/sale-type");
            GetSpecificPromo(url, function(url2, offer2){
                callback(url2, offer2);
            });
        }
        if (!error && response.statusCode == 200) {
            for(var i = 0; i < JSON.parse(body).length; i++){
                var menu = JSON.parse(body)[i];
                if(menu["is_special_offer"])
                    offer = true;
            }
            callback(url, offer);
        }
    });
}

exports.GetPromotion = function(callback){
    fs.readFile('lafourchette_details.json', 'utf8', function (err, data) {
        console.log('\033[2J');
        console.log("0/" +   JSON.parse(data).length);
        if (err) throw err;
        var count = 0;
        var end = false;
        for(var attributename in JSON.parse(data)){
            GetSpecificPromo(JSON.parse(data)[attributename].fourchette_url, function(url, offer){
                count++;
                console.log('\033[2J');
                console.log(count + "/" + JSON.parse(data).length);
                if(count == JSON.parse(data).length)
                    end = true;
                callback("https://www.lafourchette.com" + url, offer, end);
            });

        }
    });  
};