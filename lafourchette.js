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
        console.log("0/" +   JSON.parse(data).length);
        if (err) throw err;
        var count = 0;
        for(var attributename in JSON.parse(data)){
            /*request({
                headers: {
                    'Content-Length': 0,
                    'Content-Type': 'text/html',
                    'User-Agent': 'request'
                },
                uri: 'https://www.lafourchette.com' + JSON.parse(data)[attributename].fourchette_url,
                method: 'GET'
            }, function (error, response, body) {
                console.log(body);
                if (!error && response.statusCode == 200) {
                    var $ = cheerio.load(body);
                    $('.moduleSaleType').filter(function(){
                        console.log("Find restaurant !");
                        callback(JSON.parse(data)[attributename].fourchette_url);
                    });
                    count++;
                    console.log(count + "/" +   JSON.parse(data).length);
                }
            });*/
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://www.lafourchette.com' + JSON.parse(data)[attributename].fourchette_url, true);
            xhr.send();

            xhr.onreadystatechange = processRequest;

            function processRequest(e) {
                console.log(xhr.responseText);
            }
        }
    });  
};