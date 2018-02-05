var request = require('request');
var fs = require('fs');
var info = [];

exports.GetAllRestaurant = function () {
    for(i = 0; i < 34; i++){ // 34 pages
        request('https://restaurant.michelin.fr/search-restaurants?localisation=1424&cooking_type=&gm_selection=1&stars=1%7C%7C3&bib_gourmand=&piecette=&michelin_plate=&services=&ambiance=&booking_activated=&min_price=&max_price=&number_of_offers=&prev_localisation=1424&latitude=&longitude=&bbox_ne_lat=&bbox_ne_lon=&bbox_sw_lat=&bbox_sw_lon=&page_number=' + i + '&op=Rechercher&js=true', function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var new_info = JSON.parse(body);
                for(var x in new_info[1]["settings"]["search_result_markers"]){
                    info.push(new_info[1]["settings"]["search_result_markers"][x]);
                }
            }
        });
    }
    setTimeout(function() {
        fs.writeFile('michelin.json', JSON.stringify(info), 'utf8');
        console.log('File created !');
    }, 10000);
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