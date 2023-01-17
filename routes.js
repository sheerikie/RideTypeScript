"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.router = void 0;
var express_1 = require("express");
var mongoose_1 = require("mongoose");
var jwt = require("jsonwebtoken");
var express_validator_1 = require("express-validator");
var winston_1 = require("winston");
var model_1 = require("./model");
require('dotenv').config();
// Use the router in the express app
exports.router = (0, express_1.Router)();
var adminUsername = 'admin';
var adminPassword = 'password';
var secretKey = 'adamruinseverything';
mongoose_1["default"].connect(process.env.MONGO_URI);
var logger = (0, winston_1.createLogger)({
    level: 'info',
    format: winston_1.format.json(),
    transports: [
        new winston_1.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston_1.transports.File({ filename: 'logs/combined.log' }),
    ]
});
exports.router.use(function (err, req, res, next) {
    logger.error(err.stack);
    res.status(500).send({
        message: "Server Error",
        status: 500
    });
});
var checkAuth = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var token, decoded;
    return __generator(this, function (_a) {
        try {
            token = req.headers.authorization.split("")[1];
            decoded = jwt.verify(token, secretKey);
            req.userData = decoded;
            next();
        }
        catch (error) {
            return [2 /*return*/, res.status(401).json({
                    message: 'Auth failed'
                })];
        }
        return [2 /*return*/];
    });
}); };
exports.router.post("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, token;
    return __generator(this, function (_b) {
        _a = req.body, username = _a.username, password = _a.password;
        if (username === adminUsername && password === adminPassword) {
            console.log(username, password, jwt);
            token = jwt.sign({ username: username }, secretKey, {
                algorithm: "HS256",
                expiresIn: '11111'
            });
            return [2 /*return*/, res.status(200).json({
                    message: "Login successful",
                    token: token
                })];
        }
        else {
            return [2 /*return*/, res.status(401).send({
                    message: "Invalid credentials",
                    status: 401
                })];
        }
        return [2 /*return*/];
    });
}); });
exports.router.post("/drivers", checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, name_1, carType, newDriver, driver, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                _a = req.body, name_1 = _a.name, carType = _a.carType;
                newDriver = new model_1.Driver({ name: name_1, carType: carType });
                return [4 /*yield*/, newDriver.save()];
            case 2:
                driver = _b.sent();
                return [2 /*return*/, res.status(201).json({
                        message: "Driver created successfully",
                        driver: driver
                    })];
            case 3:
                err_1 = _b.sent();
                return [2 /*return*/, res.status(500).json({
                        message: "Error creating driver",
                        error: err_1
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.router.patch("/drivers/:id/suspend", checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var driver, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, model_1.Driver.findByIdAndUpdate(req.params.id, { suspended: true }, { "new": true })];
            case 1:
                driver = _a.sent();
                if (!driver) {
                    return [2 /*return*/, res.status(404).json({
                            message: "Driver not found"
                        })];
                }
                res.status(200).json({
                    message: "Driver suspended successfully",
                    driver: driver
                });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                res.status(500).json({
                    message: "Error suspending driver",
                    error: err_2
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.router.get("/rides", checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var rides, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, model_1.Ride.find({ ended: false }).populate('passengerId driverId')];
            case 1:
                rides = _a.sent();
                res.status(200).json({
                    message: "Ongoing rides retrieved successfully",
                    rides: rides
                });
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                res.status(500).json({
                    message: "Error getting ongoing rides",
                    error: err_3
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.router.post("/passengers", checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, name_2, pickupLocation, newPassenger, passenger, err_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                _a = req.body, name_2 = _a.name, pickupLocation = _a.pickupLocation;
                newPassenger = new model_1.Passenger({ name: name_2, pickupLocation: pickupLocation });
                return [4 /*yield*/, newPassenger.save()];
            case 2:
                passenger = _b.sent();
                res.status(201).json({
                    message: "Passenger created successfully",
                    passenger: passenger
                });
                return [3 /*break*/, 4];
            case 3:
                err_4 = _b.sent();
                res.status(500).json({
                    message: "Error creating passenger",
                    error: err_4
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.router.post("/rides", checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var errors, _a, passengerId, driverId, pickupLocation, dropoffLocation, newRide, ride, err_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                errors = (0, express_validator_1.validationResult)(req);
                if (!errors.isEmpty()) {
                    return [2 /*return*/, res.status(400).json({ errors: errors.array() })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                _a = req.body, passengerId = _a.passengerId, driverId = _a.driverId, pickupLocation = _a.pickupLocation, dropoffLocation = _a.dropoffLocation;
                newRide = new model_1.Ride({ passengerId: passengerId, driverId: driverId, pickupLocation: pickupLocation, dropoffLocation: dropoffLocation });
                return [4 /*yield*/, newRide.save()];
            case 2:
                ride = _b.sent();
                res.status(201).json({
                    message: "Ride simulated successfully",
                    ride: ride
                });
                return [3 /*break*/, 4];
            case 3:
                err_5 = _b.sent();
                res.status(500).json({
                    message: "Error simulating ride",
                    error: err_5
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.router.patch("/rides/:id/end", checkAuth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ride, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, model_1.Ride.findByIdAndUpdate(req.params.id, { ended: true }, { "new": true })];
            case 1:
                ride = _a.sent();
                if (!ride) {
                    return [2 /*return*/, res.status(404).json({
                            message: "Ride not found"
                        })];
                }
                res.status(200).json({
                    message: "Ride ended successfully",
                    ride: ride
                });
                return [3 /*break*/, 3];
            case 2:
                err_6 = _a.sent();
                res.status(500).json({
                    message: "Error ending ride",
                    error: err_6
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
