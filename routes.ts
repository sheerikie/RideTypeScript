import { Router } from "express";
import mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator';
import { createLogger, format, transports } from 'winston';
import request from 'supertest';

import {Driver, Ride, Passenger} from "./model"


require('dotenv').config();
// Use the router in the express app

export const router = Router();

const adminUsername = process.env.ADMIN_USERNAME;//admin
const adminPassword = process.env.ADMIN_PASSWORD;//password
const secretKey = process.env.SECRET_KEY;

mongoose.connect(process.env.MONGO_URI);

const logger = createLogger({
    level: 'info',
    format: format.json(),
    transports: [
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' }),
    ],
});

router.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send({
        message: "Server Error",
        status: 500
    });
});



const checkAuth = async (req, res, next) => {
    try {
      
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token,secretKey);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
   
if (username === adminUsername && password === adminPassword)
{
    console.log(username,password,jwt);
    
    const token = jwt.sign({ username }, secretKey, {
		algorithm: "HS256"
	})
    return  res.status(200).json({
    message: "Login successful",
    token: token
    });
 } else {
    return res.status(401).send({
    message: "Invalid credentials",
    status: 401
    });
}
});

router.post("/drivers", checkAuth, async (req, res) => {
const errors = validationResult(req);
if (!errors.isEmpty()) {
return res.status(400).json({ errors: errors.array() });
}
try {
const { name, carType } = req.body;
const newDriver = new Driver({ name, carType });
const driver = await newDriver.save();
return res.status(201).json({
message: "Driver created successfully",
driver
});
} catch (err) {
return res.status(500).json({
message: "Error creating driver",
error: err
});
}
});

router.patch("/drivers/:id/suspend", checkAuth, async (req, res) => {
try {
const driver = await Driver.findByIdAndUpdate(req.params.id, { suspended: true }, { new: true });
if (!driver) {
return res.status(404).json({
message: "Driver not found"
});
}
res.status(200).json({
message: "Driver suspended successfully",
driver
});
} catch (err) {
res.status(500).json({
message: "Error suspending driver",
error: err
});
}
});

router.get("/rides", checkAuth, async (req, res) => {
try {
const rides = await Ride.find({ ended: false }).populate('passengerId driverId');
res.status(200).json({
message: "Ongoing rides retrieved successfully",
rides
});
} catch (err) {
res.status(500).json({
message: "Error getting ongoing rides",
error: err
});
}
});

router.post("/passengers", checkAuth, async (req, res) => {
const errors = validationResult(req);
if (!errors.isEmpty()) {
return res.status(400).json({ errors: errors.array() });
}
try {
const { name, pickupLocation } = req.body;
const newPassenger = new Passenger({ name, pickupLocation });
const passenger = await newPassenger.save();
res.status(201).json({
message: "Passenger created successfully",
passenger
});
} catch (err) {
res.status(500).json({
message: "Error creating passenger",
error: err
});
}
});

router.post("/rides", checkAuth, async (req, res) => {
const errors = validationResult(req);
if (!errors.isEmpty()) {
return res.status(400).json({ errors: errors.array() });
}
try {
const { passengerId, driverId, pickupLocation, dropoffLocation } = req.body;
const newRide = new Ride({ passengerId, driverId, pickupLocation, dropoffLocation });
const ride = await newRide.save();
res.status(201).json({
message: "Ride simulated successfully",
ride
});
} catch (err) {
res.status(500).json({
message: "Error simulating ride",
error: err
});
}
});

router.patch("/rides/:id/end", checkAuth, async (req, res) => {
try {
const ride = await Ride.findByIdAndUpdate(req.params.id, { ended: true }, { new: true });
if (!ride) {
return res.status(404).json({
message: "Ride not found"
});
}
res.status(200).json({
message: "Ride ended successfully",
ride
});
} catch (err) {
res.status(500).json({
message: "Error ending ride",
error: err
});
}
});
