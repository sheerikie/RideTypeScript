import request from 'supertest';
import mongoose from 'mongoose';
import {Driver, Ride, Passenger} from "../model"
import{ router} from '../routes';

const adminUsername = 'admin';
const adminPassword = 'password';
const secretKey = 'adamruinseverything';

let token;
let driverId;
let passengerId;
let rideId;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Authentication routes', () => {
    test('It should login successfully', async () => {
        console.log('(process.env.MONGO_URI)',process.env.MONGO_URI);
        console.log('(process.env.MONGO_URI)',router);
        const res = await request(router)
            .post('/login')
            .send({ username: adminUsername, password: adminPassword });


            console.log('(process.env.MONGO_URI)',res);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
    });
});

describe('Driver routes', () => {
    test('It should create a new driver', async () => {
        const res = await request(router)
            .post('/drivers')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'John Smith', carType: 'Sedan' });
        expect(res.statusCode).toEqual(201);
        expect(res.body.driver).toHaveProperty('name', 'John Smith');
        expect(res.body.driver).toHaveProperty('carType', 'Sedan');
        driverId = res.body.driver._id;
    });

    test('It should suspend a driver', async () => {
        const res = await request(router)
            .patch(`/drivers/${driverId}/suspend`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.driver).toHaveProperty('suspended', true);
    });
});

describe('Passenger routes', () => {
    test('It should create a new passenger', async () => {
        const res = await request(router)
            .post('/passengers')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Jane Smith', pickupLocation: '123 Main St' });
        expect(res.statusCode).toEqual(201);
        expect(res.body.passenger).toHaveProperty('name', 'Jane Smith');
        expect(res.body.passenger).toHaveProperty('pickupLocation', '123 Main St');
        passengerId = res.body.passenger._id;
    });
});

describe('Ride routes', () => {
    test('It should simulate a new ride', async () => {
        const res = await request(router)
            .post('/rides')
            .set('Authorization', `Bearer ${token}`)
            .send({ passengerId, driverId, pickupLocation: '456 Park Ave', dropoffLocation: '789 Elm St' });
        expect(res.statusCode).toEqual(201);
        expect(res.body.ride).toHaveProperty('pickupLocation', '456 Park Ave');
        expect(res.body.ride).toHaveProperty('dropoffLocation', '789 Elm St');
        rideId = res.body.ride._id;
    });

    test('It should get all ongoing rides', async () => {
        const res = await request(router)
            .get('/rides')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.rides).toBeInstanceOf(Array);
    });

    test('It should end a ride', async () => {
        const res = await request(router)
            .patch(`/rides/${rideId}/end`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.ride).toHaveProperty('ended', true);
    });
    });
    
    describe('Error handling', () => {
    test('It should return a 401 status code for an unauthorized request', async () => {
    const res = await request(router)
    .get('/rides');
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Auth failed');
    });
    test('It should return a 404 status code for a non-existent resource', async () => {
        const res = await request(router)
            .patch(`/rides/5f7d8e1f7c7f3a0b8c7f3a0b/end`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'Ride not found');
    });
    
    test('It should return a 500 status code for a server error', async () => {
        const spy = jest.spyOn(Driver, 'findByIdAndUpdate').mockImplementationOnce(() => {
            throw new Error('Server error');
        });
        const res = await request(router)
            .patch(`/drivers/${driverId}/suspend`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('message', 'Error suspending driver');
        spy.mockRestore();
    });
});
