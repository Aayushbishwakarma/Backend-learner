const express = require('express');             //a framework to create web servers easily
const app = express();                          //your actual web application
const path = require('path');                   //helps work with file paths safely
const fs = require('fs');                       //lets Node.js read/write files on your computer

app.set("view engine","ejs");


app.use(express.json());                        //It helps to Read JSON data
app.use(express.urlencoded({extended: true}));  //It helps to Read data from Form/HTML data



app.use(express.static(path.join(__dirname,"public")));

app.get('/',function(req,res){
    fs.readdir(`./files`,function(err, files){
         res.render("index",{files: files});
    })
})

app.get('/files/:filename',function(req,res){
    fs.readFile(`./files/${req.params.filename}`, "utf-8", function(err,filedata){
        res.render('show', {filename: req.params.filename, filedata:filedata});
    })
})

app.post('/create',function(req,res){
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, function(err){
        res.redirect("/")
    });
})

app.listen(3000);