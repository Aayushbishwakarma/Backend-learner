const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userModel = require('./models/user');
const postModel = require('./models/post');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const mongoUri = process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET || 'sshhh';

if (!mongoUri) {
    console.error('MongoDB connection string is missing. Set MONGO_URI in Render to your MongoDB Atlas connection string.');
    process.exit(1);
}

mongoose.connect(mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    });

app.set('view engine', 'ejs'); 
app.use(express.json());
app.use(express.urlencoded({ extended:true}));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/logout', (req, res) => {
    res.clearCookie('token',"");
    res.redirect('/login');
});

app.get('/profile',isLoggedIn, async (req, res) => {
    let user =await userModel.findOne({email: req.user.email}).populate('posts');
    res.render('profile', {user});
});


app.get('/like/:id',isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({_id: req.params.id}).populate('user');

    if(post.likes.indexOf(req.user.userid) === -1){
    post.likes.push(req.user.userid);
    }
    else{
        post.likes.splice(post.likes.indexOf(req.user.userid),1);
    }
    await post.save();
    res.redirect('/profile');
});

app.get('/edit/:id',isLoggedIn, async (req, res) => {
    let post = await postModel.findOne({_id: req.params.id}).populate('user');

    res.render('edit', {post});
    
});


app.post('/edit/:id',isLoggedIn, async (req, res) => {
    let post = await postModel.findOneAndUpdate(
        {_id: req.params.id},
        {content: req.body.content}
    );
    res.redirect('/profile');
});



app.post('/post',isLoggedIn, async (req, res) => {
    let user =await userModel.findOne({email: req.user.email})
    let post = await postModel.create({
        user: user._id,
        content: req.body.content
    });

    user.posts.push(post._id);
    await user.save();
    res.redirect('/profile');
});

app.post('/register', async(req, res) => {
    let{email, username, name , password, age} = req.body ;

    let user = await userModel.findOne({email})
    if(user) return res.status(409).json({ message: 'User already exists' });

    bcrypt.genSalt(10, (err, salt) =>{
        bcrypt.hash(password, salt, async(err, hash) =>{
           let user = await userModel.create({
                email,
                username,
                name,
                password: hash,
                age
            });

            res.status(201).json({ message: 'registered', redirect: '/login' });
        })
    })
});


app.post('/login', async(req, res) => {
    let{email, password} = req.body ;

    let user = await userModel.findOne({email})
    if(!user) return res.status(400).json({ message: 'Invalid email or password' });

    bcrypt.compare(password, user.password, function (err,result) {
        if(result) {
            let token = jwt.sign({email: email, userid: user._id}, jwtSecret);
            res.cookie('token', token);
            res.status(200).json({ message: 'logged in', redirect: '/profile' });     
        }
        else res.status(400).json({ message: 'Invalid email or password' });
    })
});


function isLoggedIn(req, res, next) {
   if(req.cookies.token === "") res.redirect("/login");
   else{
    let data = jwt.verify(req.cookies.token, jwtSecret);
    req.user = data;
   
   next();

   }

}



app.listen(process.env.PORT || 3000);