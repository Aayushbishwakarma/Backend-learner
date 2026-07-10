const mongoose = require("mongoose");


const accountSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true,"Account must belong to a user"],
        index: true
    },

    status:{
        type: String,
        enum: ["active","frozen","closed"],
        message: "Status must be either active, frozen, or closed",
        default: "active"
    },

    currency:{
        type: String,
        enum: ["USD","EUR","GBP","NPR"],
        message: "Currency must be either USD, EUR, GBP, or NPR",
        default: "NPR"
    },

    timestamp:true
})

accountSchema.index({user: 1,status: 1});


const accountModel = mongoose.model("Account", accountSchema);

module.exports = accountModel;