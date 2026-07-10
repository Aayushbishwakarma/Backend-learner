const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");


/**
 * - User Registration Controller
 * - POST/api/auth/register
 */
async function userRegisterController(req, res) {
    const{email, name, password} = req.body;

    const isExist = await userModel.findOne({
        email: email
    });

    if(isExist){
        return res.status(400).json({
            success: false,
            message: "Email already exists",
            status: "failed"
        })
    }


    const user = await userModel.create({
        email,name,password
    });

   const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
        expiresIn: "1d"
    });

    res.cookie("token", token);

    res.status(201).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token,
        success: true,
        message: "User registered successfully"
    })

    await emailService.sendRegistrationEmail(user.email, user.name);
}


/**
 * - User Login Controller
 * - POST/api/auth/login
 */
async function userLoginController(req, res) {
    const{email, password} = req.body;

    const user = await userModel.findOne({email}).select("+password");

    if(!user){
        return res.status(400).json({
            success: false,
            message: "Invalid email or password",
            status: "failed"
        })
    }
    const isvalidPassword = await user.comparePassword(password)
    if(!isvalidPassword){
        return res.status(400).json({
            success: false,
            message: "Invalid email or password",
            status: "failed"
        })
    }

    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
        expiresIn: "1d"
    });

    res.cookie("token", token);

    res.status(200).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name
        },
        token,
        success: true,
        message: "User logged in successfully"
    })

    
}

module.exports = {userRegisterController, userLoginController};