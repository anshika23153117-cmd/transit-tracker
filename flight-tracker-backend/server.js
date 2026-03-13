require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB =require('./config/db');
const flightRoutes = require('./routes/flightRoutes');
const rateLimit = require('express-rate-limit');



const app = express();
connectDB();

//middleware
 app.use(cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173'
})); //enable cors so frontend can talk to us
app.use(express.json());// allow server to handle json data 

if (!process.env.AIRLABS_API_KEY) {
    console.error("FATAL ERROR: AIRLABS_API_KEY is not defined in .env file.");
    process.exit(1); // Stops the server immediately
  }
  
  if (!process.env.MONGO_URI) {
    console.error("FATAL ERROR: MONGO_URI is not defined in .env file.");
    process.exit(1);
  }




// --- RATE LIMITER CONFIGURATION ---
// This protects your API key by limiting how often the Live Sync can be called.
const liveSyncLimiter = rateLimit({
    windowMs:2*60*1000, //2 minutes
    max: 1,//limit each IP to 1 request per window
    message: {error:"too many live syncs.please use 'Load from DB'or wait 2 minutes"},
    standardHeaders: true,
    legacyHeaders: false,
});
// Apply the strict limiter ONLY to the live sync route
//middleware
app.use('/api/flights',(req,res,next)=>{
    // If the request is specifically for the Live API Sync (the root '/')
    if(req.path === '/' && req.method === 'GET') {
        return liveSyncLimiter(req,res,next);
    }
    next();
})

app.use('/api/flights',flightRoutes);

    
    //start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT,'0.0.0.0',()=>{
    console.log(`server is running on ${PORT}`);
});

