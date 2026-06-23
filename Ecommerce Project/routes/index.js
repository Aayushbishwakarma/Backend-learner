const express = require('express');
const router = express.Router();
const isLoggedin = require("../middlewares/isLoggedin");
const productModel = require("../models/product-model");
const userModel = require("../models/user-models");


router.get("/", function (req , res){
    let error = req.flash("error");
    res.render("index",{error, loggedin : false});
});

router.get("/shop",isLoggedin, async function (req , res){
    let products = await productModel.find();
    res.render("shop",{products, loggedin: true});
});

router.get("/addtocart/:id",isLoggedin, async function (req , res){
    let user = await userModel.findOne({user: req.user.email});
});

router.get("/logout", isLoggedin, function (req , res){
    res.render("logout");
})


module.exports = router;