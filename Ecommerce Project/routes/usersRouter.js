const express = require("express");
const router = express.Router();
const userModel = require("../models/user-models");
const { registerUser } = require("../controllers/authController");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generatetoken");



router.get("/", (req, res) => {
    res.send("hey");
});



router.post("/register", registerUser);

module.exports = router;