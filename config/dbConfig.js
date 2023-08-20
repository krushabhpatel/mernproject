const mongoose = require('mongoose');

mongoose.connect(process.env.mongo_url)
const db = mongoose.connection;
db.on('connected',()=>{
    console.log('mongo Db connection successful');
});
db.on('error',()=>{
    console.log('mongo Db connection failed ');
});