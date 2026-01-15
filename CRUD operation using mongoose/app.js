const express = require('express');
const app = express();
const path = require('path');   
const userModel = require('./models/user');

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/read', async (req, res) => {
    let allusers = await userModel.find();
    res.render('read', { users: allusers });
});

app.get('/edit/:id', async (req, res) => {
    let user = await userModel.findById(req.params.id);
    res.render('edit', { user });
});

app.post('/update/:userid', async (req, res) => {
    let { image, name, email } = req.body;

    await userModel.findOneAndUpdate({ _id: req.params.userid },{ image, name, email },{ new: true });

    res.redirect('/read');
});

app.get('/delete/:id', async (req, res) => {
    await userModel.findOneAndDelete({ _id: req.params.id });
    res.redirect('/read');
});

app.post('/create', async (req, res) => {
    let createdUser = await userModel.create({
        name: req.body.name,
        email: req.body.email,
        image: req.body.image
    });

    res.redirect('/read'); // better UX than res.send
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
