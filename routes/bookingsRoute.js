const authMiddleware = require('../middlewares/authMiddleware.js');
const bookingsModel = require('../models/bookingsModel.js');
const router = require('express').Router();
const busModel = require('../models/busModel');
const stripe = require("stripe")(process.env.stripe_key);
const {v4:uuidv4} = require("uuid");
router.post("/book-seat",authMiddleware, async(req,res)=>{
    try {
        const newBooking = new bookingsModel({
            ...req.body,
            user: req.body.userId,
        })
        await newBooking.save();
        const bus = await busModel.findById(req.body.bus);
        bus.seatsBooked = [...bus.seatsBooked, ...req.body.seats];
        await bus.save();
        res.status(200).send({
            message:"Booking successful",
            data: newBooking,
            success:true,
        });
    } catch (error) {
        res.status(500).send({
            message:"Booking failed",
            data:error,
            success:false,
        });
    }
});
router.post("/make-payment",authMiddleware, async(req,res)=>{
    try {
        const {token , amount} = req.body;
        const customer = await stripe.customers.create({
            email:token.email,
            source:token.id
        })
        const payment = await stripe.charges.create({
            amount:amount,
            currency:"inr",
            customer:customer.id,
            receipt_email:token.email,
        },{
            idempotencyKey:uuidv4(),
        });
        if(payment){
            res.staus(200).send({
                message:"Payment Successful",
                data:{transactionId: payment.source.id,},
                success:true,
            });
        }else{
            res.status(500).send({
                message:"Payment failed",
                data:error,
                success:false,
            });
        }
    } catch (error) {
        res.status(500).send({
            message:"Booking failed",
            data:error,
            success:false,
        });
    }
});

router.post("/get-bookings-by-user-id",authMiddleware,async(req,res)=>{
    try {
        const bookings = await bookingsModel.find({user: req.body.userId}).populate("bus").populate("user");
        res.status(200).send({
            message:"bookings fetched successfully",
            data: bookings,
            success:true,
        });
    } catch (error) {
        res.status(500).send({
            message:"bookings fetch failed",
            data:error,
            success:false,
        });
    }
});
module.exports = router;