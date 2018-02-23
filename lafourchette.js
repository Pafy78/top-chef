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

exports.GetPromotion = function(callback){
    fs.readFile('lafourchette_details.json', 'utf8', function (err, data) {
        console.log('\033[2J');
        console.log("0/" +   JSON.parse(data).length);
        if (err) throw err;
        var count = 0;
        for(var attributename in JSON.parse(data)){
            //var url = 'https://www.lafourchette.com/reservation/module/date-list/' + JSON.parse(data)[attributename].fourchette_url.split("/")[3];
            var url = 'https://www.lafourchette.com' + JSON.parse(data)[attributename].fourchette_url;
            var configuration = {
                'uri': url,
                'headers': {
                    'cookie': 'datadome=AHrlqAAAAAMAF4a7sY37iSUAVvJqHA=='
                }
            };
            request(configuration, function (error, response, body) {
                /*console.log(body.substring(174,206));
                configuration = {
                    'uri': url,
                    'headers': {
                        'cookie': 'datadome=' + body.substring(174,206)
                    }
                };*/
                if (!error && response.statusCode == 200) {
                    count++;
                    console.log('\033[2J');
                    console.log(count + "/" +   JSON.parse(data).length);
                    var $ = cheerio.load(body);
                    $('.moduleSaleType').filter(function(){
                        console.log("Restaurant found !");
                        if(count == JSON.parse(data).length){
                            callback(JSON.parse(data)[attributename].fourchette_url, true);
                        }
                        else{
                            callback(JSON.parse(data)[attributename].fourchette_url);
                        }

                    });
                }
            });
        }
    });  
};