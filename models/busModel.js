const mongoose = require('mongoose');
const busSchema = new mongoose.Schema(
    {
    name:{
        type:String,
        required:true
    },
    number:{
        type:String,
        required:true
    },
    capacity:{
        type:Number,
        required:true
    },
    from:{
        type:String,
        default:true,
    },
    to:{
        type:String,
        default:true,
    },
    journeyDate:{
        type:String,
        default:true,
    },
    departure:{
        type:String,
        default:true,
    },
    arrival:{
        type:String,
        default:true,
    },
    type:{
        type:String,
        default:true,
    },
    price:{
        type:Number,
        default:true,
    },
    seatsBooked:{
        type:Array,
        default:[],
    },
    status:{
        type:String,
        default:"Yet to Start",
    }
    },
);

module.exports = mongoose.model("buses",busSchema);