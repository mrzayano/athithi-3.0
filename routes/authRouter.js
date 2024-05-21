const express = require('express');
const router = express.Router();

// Predefined username and password
const predefinedUsername = "zayan";
const predefinedPassword = "123";

router.use(function (req, res, next) {
    if (req.session.user) {
        res.redirect('/auth/login');
        
    } else {
        next();
    }
});

router.get('/login', function(req, res) {
    res.render('auth/login');
});


router.post('/login', function(req, res) {
    const { username, password } = req.body;

    // Check if username and password match the predefined values
    if (username === predefinedUsername && password === predefinedPassword) {
        // Set a user object in the session to indicate that the user is authenticated
        req.session.user = { username: username }; // This is line 19

        // Redirect to a protected route or render a different page
        res.redirect('/admin/dashboard');
    } else {
        res.send('Invalid username or password');
    }
});



module.exports = router;
