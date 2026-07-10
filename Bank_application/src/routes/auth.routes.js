const express= require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const app = express();

router.post("/register", authController.userRegisterController);

router.post("/login", authController.userLoginController);


module.exports = router;