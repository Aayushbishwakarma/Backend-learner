const express = require("express");
const router = express.Router();
const productModel = require("../models/product-model");

router.post("/create", upload.single("image"), async (req, res) => {
    try {
        let {name, price, discount, bgcolour, panelcolour, textcolour} = req.body;

        let product = await productModel.create({
            name,
            price,
            discount,
            bgcolour,
            panelcolour,
            textcolour
        });
        req.flash("success", "Product created successfully");
        res.redirect("/owners/admin");
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error creating product" });
    }
});


module.exports = router;