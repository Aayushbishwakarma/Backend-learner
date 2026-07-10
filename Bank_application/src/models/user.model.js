const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");



const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: [true, "email is required"],
        trim: true,
        lowercase: true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email format"],
        unique: [true,"Email already exists"]
    },


    name:{
        type: String,
        required: [true, "name is required"],
        trim: true
    },

    password:{
        type: String,
        required:[true,"password is required"],
        minlength:[6,"password must be at least 6 characters long"],
        select: false
    }
},{
    timestamps: true
})

userSchema.pre("save", async function(){
    if(!this.isModified("password")){
        return 
    }

    const hash = await bcrypt.hash(this.password,10)
    this.password = hash;

    return 
})

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;