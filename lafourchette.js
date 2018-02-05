var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');

exports.GetRestaurantByTitle = function (title) {
    title = title.replace(" ", "%20");
    request('https://www.lafourchette.com/search-refine/' + title, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body);
            $('.resultItem-name').filter(function(){
                
                var data = $(this);
                
                return data.children().first().attr()["href"];
            });
        }
    });
};