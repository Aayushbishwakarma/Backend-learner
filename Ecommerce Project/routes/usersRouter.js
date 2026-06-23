const express = require("express");
const router = express.Router();
const userModel = require("../models/user-models");
const { registerUser , loginUser, logout } = require("../controllers/authController");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generatetoken");



router.get("/", (req, res) => {
    res.send("hey");
});



router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logout);

module.exports = router;