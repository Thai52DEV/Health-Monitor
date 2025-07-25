require('dotenv').config();

const express = require('express');
const path = require('path');
const connectDB = require('./server/config/databaseconnect');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 5000;

//Connect to DB 
connectDB();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'../Frontend')));

// app.use(express.static('public'));
// Truy cap thong qua EJS de hon 

app.use('/',require('./server/routes/main').router);
// app.use('/booking',require('./server/routes/booking'));
app.use('/doctor',require('./server/routes/doctor'));
app.use('/booking',require('./server/routes/booking'));
app.use('/booking_doctor',require('./server/routes/booking_doctor'));
app.listen(PORT, ()=> {
    console.log(`App listening on port ${PORT}`);
});