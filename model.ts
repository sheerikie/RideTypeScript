import mongoose, {ConnectOptions,Schema} from "mongoose";


const driverSchema = new Schema({
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
        default: false
    }
});

const Driver = mongoose.model("Driver", driverSchema);

const rideSchema = new Schema({
    passengerId: {
        type: Schema.Types.ObjectId,
        ref: "Passenger",
        required: true
    },
    driverId: {
        type: Schema.Types.ObjectId,
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
        default: false
    }
});

const Ride = mongoose.model("Ride", rideSchema);

const passengerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    pickupLocation: {
        type: String,
        required: true
    }
});

const Passenger = mongoose.model("Passenger", passengerSchema);

export { Driver, Ride, Passenger };
