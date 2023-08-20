const usersModel = require('../models/usersModel');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const router = require('express').Router();
const authMiddleware = require('../middlewares/authMiddleware.js')

router.post('/register', async (req, res) => {
    try {
        const existinguser = await usersModel.findOne({ email: req.body.email });
        if (existinguser) {
            return res.send({
                message: "User already exists",
                success: false,
                data: null,
            });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;
        const newUser = new usersModel(req.body)
        await newUser.save();
        res.send({
            message: "User created successfully",
            success: true,
            data: null,
        });

    } catch (error) {
        res.send({
            message: error.message,
            success: true,
            data: null,
        });

    }
});
router.post("/login", async (req, res) => {
    try {
        const userExists = await usersModel.findOne({ email: req.body.email });
        if (!userExists) {
            return res.send({
                message: "User does not exist",
                success: false,
                data: null,
            });
        }
        if(userExists.isBlocked) 
        {
            return res.send({
                message:"User is Blocked",
                data:null,
                success:false,
            });
        }
        const passwordMatch = await bcrypt.compare(
            req.body.password,
            userExists.password
        );
        if (!passwordMatch) {
            return res.send({
                message: "Incorrect Password",
                success: false,
                data: null,
            });
        }
        const token = jwt.sign(
            { userId: userExists._id },
            process.env.jwt_secret,
            { expiresIn: "1d" }
        );
        res.send({
            message: "User logged in succesfully",
            success: true,
            data: token,
        });
    } catch (error) {
        res.send({
        message: error.message,
        success: false,
        data: null,
    });
    }
});

router.post("/get-user-by-id",authMiddleware,async(req,res)=>{
    try {
        const user = await usersModel.findById(req.body.userId)
        res.send({
            message:"User fetched Successfully",
            success:true,
            data:user,
        })
    } catch (error) {
        res.send({
            message:error.message,
            success:false,
            data:null,
        })
    }
})

router.post("/get-all-users",authMiddleware,async(req,res)=>{
    try {
        const users = await usersModel.find({});
        res.status(200).send({
            message:"users fetched successfully",
            data:users,
            success:true,
        });
    } catch (error) {
        res.status(500).send({
            message:"users fetched unsuccessfully",
            data:null,
            success:false,
        });
    }
});
router.post("/update-user-permissions",authMiddleware,async(req,res)=>{
    try {
        await usersModel.findByIdAndUpdate(req.body._id,req.body);
        res.status(200).send({
            message:"user updated successfully",
            data:null,
            success:true,
        });
    } catch (error) {
        res.status(500).send({
            message:"users upadated unsuccessfully",
            data:null,
            success:false,
        });
    }
});
module.exports = router;