const express = require('express');
const app = express();

const userModel =require('./usermodel');



app.get('/',(req, res) => {
    res.send("hey");
})


app.get('/create',async (req, res) => {
    let createduser = await userModel.create({
        name: "aayush",
        email: "aayushb.k2060@gmail.com",
        username: "AlphaGamer"
    })

    res.send(createduser)
})


app.get('/update',async (req, res) => {
   let updateduser = await userModel.findOneAndUpdate(
    {username :"AlphaGamer"}, 
    {name: "Aayush Bishwakarma"},{new: true})

    res.send(updateduser)
})


app.get('/delete',async (req, res) => {
   let deleteduser = await userModel.findOneAndDelete(
    {username :"AlphaGamer"}, 
    {name: "Aayush Bishwakarma"},{new: true})

    res.send(deleteduser)
})

app.listen(3000);