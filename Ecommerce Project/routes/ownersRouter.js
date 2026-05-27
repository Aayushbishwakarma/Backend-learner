const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owners-model");


router.get("/", (req, res) => {
    res.send("hey");
});

if(process.env.NODE_ENV === "development"){
    router.post("/create", async function(req, res)  {
        let owners = await ownerModel.find();
        if(owners.length > 0){ 
            return res
                .status(502)
                .send("Owners already exist")
        }


        let createdOwner = {fullname, email, password} =req.body;
        
        await ownerModel.create({
                fullname,
                email,
                password
        });
        res.status(502).send(createdOwner);
    });
}

module.exports = router;