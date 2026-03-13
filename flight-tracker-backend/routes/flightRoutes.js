const express = require('express');
const router = express.Router();
const Flight = require('../models/Flight');

router.get('/', async (req,res)=>{
    try{
        const apiKey = process.env.AIRLABS_API_KEY;
        const indiaBBox = "6.0,68.0,37.0,97.0";

        const response = await fetch(`https://airlabs.co/api/v9/flights?api_key=${apiKey}&bbox=${indiaBBox}`);
        const data = await response.json();
        console.log("AirLabs API returned:", data.response?.length || 0, "flights"); // TEST 1
        if(data.response && Array.isArray(data.response)) { //data
            const ops = data.response.map(flight=> ({
                updateOne: {
                    filter: { flight_hex: flight.hex},//search
                    update: {
                        ...flight,
                        flight_hex: flight.hex,//the storage or maybe use in creation by upsert
                        updated_at: new Date(),
                        $push: {
                            history:{
                            $each: [{lat: flight.lat,lng: flight.lng,timestamp:new Date()}],
                            $slice: -50 //keep only 50 most recent points
                            } //$ it is an operator for built in function
                        },
                        updated_at: new Date()
                    },
                    upsert: true
                }

            }));
            const result= await Flight.bulkWrite(ops); //server benefit 
            console.log("Database updated. Upserted count:", result.upsertedCount); // TEST 2

            
        }
        res.json(data); //user benefit-if your internet is down, the database is locked, or you made a typo in your code that causes a TypeError.
    } catch(error){ //server crash -if your internet is down, the database is locked, or you made a typo in your code that causes a TypeError.
        console.error("flight route error",error);
        res.status(500).json({error:"server error"});
    }
});

//fetch only from mongodb(uses 0 airlabs credits)
router.get('/cache',async (req,res)=>{
    try{
        const cachedFlights = await Flight.find({});
        res.json({response: cachedFlights});
    } catch( error) {
        res.status(500).json({error:"failed to fetch cached data"});
    }
})
//add search by ICAO or FlightNumber
router.get('/search',async (req,res)=>{
    try{
        const {query}= req.query; // destruction in js
        // Fix: If no query, just return an empty array instead of crashing
        if (!query || query.trim() === "") {
        return res.json({ response: [] });
      }
        //searches for the query  string in flight_icao or flight_number(case-insensitive)
        const flights = await Flight.find({
            $or : [
                {flight_icao:{$regex: query,$options: 'i'}},//search power
                {flight_number:{$regex: query,$options: 'i'}}
            ]
        }).limit(20);//limit results to keep the map clean
        res.json({response: flights});
    } catch(error){
        res.status(500).json({error:"search failed"});
    }
});

    

module.exports = router;