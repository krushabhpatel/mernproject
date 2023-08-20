const busModel = require('../models/busModel');
const authMiddleware = require('../middlewares/authMiddleware.js');
const router = require('express').Router();
router.post("/add-bus",async(req,res)=>{
    try {
        const existingBus = await busModel.findOne({ number: req.body.number });
        if (existingBus) {
            return res.status(200).send({
                success: false,
                message: "Bus already exist",
                
            });
        }
        const newBus = new busModel(req.body);
        await newBus.save();
        return res.status(200).send({
            success: true,
            message: "Bus added successfully",
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false,
         
    });
}});
router.post("/update-bus",authMiddleware,async(req,res)=>{
    try {
        await busModel.findByIdAndUpdate(req.body._id,req.body);
        return res.status(200).send({
            message:"Buses updated Successfully",
            success:true,
        })
    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false,
         
    });
    }
});
router.post("/delete-bus",authMiddleware,async(req,res)=>{
    try {
        await busModel.findByIdAndDelete(req.body._id,req.body);
        return res.status(200).send({
            message:"Buses deleted Successfully",
            success:true,
        })
    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false,
         
    });
    }
});
router.post("/get-all-buses",authMiddleware,async(req,res)=>{
    try {
        
        const buses = await busModel.find(req.body.number);
        return res.status(200).send({
            message:"Buses fetched Successfully",
            data:buses,
            success:true,
            
        })
    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false,
         
    });
    }
});
router.post("/get-bus-by-id",authMiddleware,async(req,res)=>{
    try {
        const bus = await busModel.findById(req.body);
        return res.status(200).send({
            message:"Buses fetched Successfully",
            success:true,
            data:bus,
        })
    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false,
         
    });
    }
});


module.exports= router;