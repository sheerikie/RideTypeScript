"use strict";
exports.__esModule = true;
var express = require("express");
var routes_1 = require("./routes");
var app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(routes_1.router);
var PORT = 3000;
app.listen(PORT, function () {
    console.log("Server running on port ".concat(PORT));
});
