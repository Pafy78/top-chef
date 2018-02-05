var request = require('request');
var fs = require('fs');

exports.GetRestaurantByTitle = function (title) {
    title = title.replace(" ", "%20");
    request('https://www.lafourchette.com/search-refine/' + title, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
    });
};