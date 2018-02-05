var http = require('http');
var michelin = require('./michelin');
var lafourchette = require('./lafourchette');
var fs = require('fs');

//michelin.GetAllRestaurant()

//lafourchette.GetRestaurantByTitle("Auberge au Boeuf");
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("Restaurant list : ");
    michelin.GetData("title", function(titles) {
        titles.forEach(function(title){
            res.write(title);
            res.write(" : ");
            //res.write(lafourchette.GetRestaurantByTitle(title));
            res.write("<br/>");
        });
        res.end();
    });
}).listen(8080);