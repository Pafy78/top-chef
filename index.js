var http = require('http');
var michelin = require('./michelin');
var lafourchette = require('./lafourchette');

//michelin.GetAllRestaurant()
console.log(michelin.GetData());
//lafourchette.GetRestaurantByTitle("Auberge au Boeuf");
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("Restaurant list : ");
    res.end();
}).listen(8080);