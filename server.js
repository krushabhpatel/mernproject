const express = require('express');
const app = express();
require('dotenv').config();
const dbconfig =require("./config/dbconfig");
const port = process.env.PORT || 8000;
app.use(express.json())
const userRoute = require('/Users/krushabhpatel/Documents/KrushabhPatel/study/SEM6/AWT /busticketbookingSystem/routes/usersRoute.js')
const busesRoute = require('./routes/busesRoute.js')
const bookingsRoute = require('./routes/bookingsRoute.js')
app.use('/api/users',userRoute)
app.use('/api/buses',busesRoute)
app.use('/api/bookings',bookingsRoute);
app.listen(port,()=>console.log(`Node sever Listening on port ${port}`));

