// const express=require('express');
// const path=require('path');
// const app=express();
// app.use(express.static(path.join(__dirname,'public')));
// app.set('view engine','ejs');
// app.get('/',(req,res)=>{
//     res.render('home');
// });
// app.get('/contact',(req,res)=>{
//     res.render('contact');
// });
// app.get('/login',(req,res)=>{
//     res.render('login');
// });
// app.get('/northindia',(req,res)=>{
//     res.render('northindia');
// });
// app.get('/southindia',(req,res)=>{
//     res.render('southindia');
// });
// app.get('/form',(req,res)=>{
//     res.render('book');
// });
// app.listen(2024);


// after adding backend
const session = require('express-session');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const authRoutes = require('./routes/Auth'); // Authentication routes
const app = express();

// Set up middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); // For form data
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect('mongodb://localhost/my_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});


// Set up session middleware
app.use(session({
    secret: 'R6rPj7m$2zL!K9pXjA8dQw^bHuNfT4sV7tPjXlW8eGfKmSd5Zg$HsQ7aPq8!',  // Replace with a secret key for session encryption
    resave: false,              // Prevents session being saved back to the store if it wasn't modified
    saveUninitialized: true,    // Forces uninitialized sessions to be saved to the store
    cookie: { 
        maxAge: 1000 * 60 * 60,  // Set session cookie to expire after 1 hour (in milliseconds)
        secure: false,          // If true, session cookies are only sent over HTTPS
    }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Example Route: Check session data before accessing a page
app.get('/', (req, res) => {
    if (req.session.userId) {
        // If user is logged in, show the home page
        return res.render('home');
    } else {
        // If no session, redirect to login page
        return res.redirect('/login');
    }
});

// Logout Route: Destroy the session and redirect to login
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error while logging out');
        }
        return res.redirect('/login');
    });
});

// Routes
app.get('/contact', (req, res) => {
  res.render('contact');
});
app.get('/register',(req,res)=>{
  res.render('register');
});
app.get('/northindia', (req, res) => {
  res.render('northindia');
});
app.get('/southindia', (req, res) => {
  res.render('southindia');
});
app.get('/form', (req, res) => {
  res.render('book');
});
app.get('/login',(req,res)=>{
  res.render('login');
})
// Authentication routes
app.use('/Auth', authRoutes); // Include auth routes

// Start the server
app.listen(2024, () => {
  console.log('Server running on port 2024');
});
