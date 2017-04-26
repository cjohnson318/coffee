"use strict";

var fs = require("fs");
var coffeeShops = {};
var maxIndex = 0;

var express    = require("express");
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json()); // for parsing application/json

var data = fs.readFileSync( "data/locations.csv", "utf8") 
data = data.split(/\r?\n/);
for (var i in data) {
    const record = data[i].split(/,\s/);
    const id = record[0];
    const intId = parseInt( id );
    if (intId > maxIndex) {
        maxIndex = intId;
    }
    var info = {
        name:      record[1],
        address:   record[2],
        latitude:  record[3],
        longitude: record[4] };
    coffeeShops[id] = info;
}

app.post("/api/create", function( req, res ) {
    var name      = req.body.name;
    var address   = req.body.address;
    var latitude  = req.body.latitude;
    var longitude = req.body.longitude;   
    maxIndex += 1;
    var newShop = {
        id: maxIndex.toString(),
        name: name,
        address: address,
        latitude: latitude,
        longitude: longitude };
    coffeeShops[maxIndex.toString()] = newShop;
    // return id of new coffee shop
    res.status(200).json( newShop );
});

app.get("/api/read", function( req, res ) {
    var id = req.query.id;
    if (!(id in coffeeShops)) {
        res.status(404);
        return;
    } 
    var resp = {
        "id"       : id,
        "name"     : coffeeShops[id].name,
        "address"  : coffeeShops[id].address,
        "latitude" : coffeeShops[id].latitude,
        "longitude": coffeeShops[id].longitude
    };
    // return address for id, or error
    res.status(200).json(resp);
});

app.put("/api/update", function( req, res ) {
    var id        = req.body.id;
    var name      = req.body.name;
    var address   = req.body.address;
    var latitude  = req.body.latitude;
    var longitude = req.body.longitude;
    // return 200 OK
    if (id in coffeeShops) {
        res.status(200).json({});
    }
    // return error if not found
    else {
        res.status(404).json({});
    }
});

app.delete("/api/delete", function( req, res ) {
    var id        = req.body.id;
    if (id in coffeeShops) {
        delete coffeeShops[id];
        if (maxIndex > 0) {
            maxIndex -= 1;
        }
        res.status(200).json({});
    }
    // return error if not found
    else {
        res.status(404).json({});
    }
});

app.get("/api/findNearest", function( req, res ) {
    var address   = req.body.address;
    // return address of nearest coffee shop
    //   interleave latitude and longitude coordinates
    //   and store them in a sorted array so that we can
    //   find sort-of near locations with a binary search,
    //   O(lg n) for the win
    res.status(200).json({});
});

/*
var server = app.listen(3000, function() {
    var port = server.address().port;
    console.log("Example app listening at %s", port);
});
*/

module.exports = app;
