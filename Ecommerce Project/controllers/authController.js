const usermodels = require("../models/user-models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generatetoken");



module.exports.registerUser = async function (req, res){
    try{
        let { email, password, fullname} = req.body;


        let user = await usermodels.findOne({email:email});
        if(user) return res.status(400).send("User already exists with this email.");

        bcrypt.genSalt(10, function(err,salt){
            bcrypt.hash(password, salt, async function(err,hash){
                if(err) return res.send("An error occurred while hashing the password.");
                else {
                    let user = await usermodels.create({
                        email,
                        password: hash,
                        fullname,
                    });

                    let token = generateToken(user);
                    res.cookie("token", token);
                    res.send("user created successfully");
                }
            });
        });
    }catch(err){
        res.status(500).send("An error occurred while creating the user.");
    }
};


module.exports.loginUser = async function (req, res){
    let { email, password } = req.body;


    let user = await usermodels.findOne({email: email});
    if(!user) return res.status(400).send("No user found with this email.");

    bcrypt.compare(password, user.password, function(err, result){
        if(result){
            let token = generateToken(user);
            res.cookie("token",token);
            res.send("Login successful");
        }
        else{
            res.status(400).send("incorrect password");
        }
    });
};