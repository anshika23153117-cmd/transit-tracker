const mongoose =require('mongoose');
const flightSchema = new mongoose.Schema({
    flight_hex: {type: String, required: true, unique: true},//unique id for the plane
    flag: String,
    lat: Number,
    lng: Number,
    alt: Number,
    dir: Number,
    speed: Number,
    v_speed: Number,
    flight_number: String,
    flight_icao: String,
    // stores coordinates
    history: [{
    lat: Number,
    lng: Number,
    timestamp: { type: Date, default: Date.now }
  }],
    updated_at: {type:Date,default: Date.now,expires:3600} //auto delete after 60 seconds

});
const flight = mongoose.model('Flight',flightSchema);
module.exports = flight;