"use strict";
exports.__esModule = true;
exports.Passenger = exports.Ride = exports.Driver = void 0;
var mongoose_1 = require("mongoose");
var driverSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    carType: {
        type: String,
        required: true
    },
    suspended: {
        type: Boolean,
        "default": false
    }
});
var Driver = mongoose_1["default"].model("Driver", driverSchema);
exports.Driver = Driver;
var rideSchema = new mongoose_1.Schema({
    passengerId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Passenger",
        required: true
    },
    driverId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Driver",
        required: true
    },
    pickupLocation: {
        type: String,
        required: true
    },
    dropoffLocation: {
        type: String,
        required: true
    },
    ended: {
        type: Boolean,
        "default": false
    }
});
var Ride = mongoose_1["default"].model("Ride", rideSchema);
exports.Ride = Ride;
var passengerSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    pickupLocation: {
        type: String,
        required: true
    }
});
var Passenger = mongoose_1["default"].model("Passenger", passengerSchema);
exports.Passenger = Passenger;
