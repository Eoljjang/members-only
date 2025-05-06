// This controller is for 'basic' users. They get less functionality.
const db = require("../db/queries");
const bcrypt = require('bcryptjs');
const passport = require("passport");


const controller ={
    home: (req, res) => {
        res.render("login");
    },
    nav_signup: (req, res) => {
        res.render("signup");

    },
    post_signup: async (req, res, next) => {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            await db.create_account(req.body.username, req.body.email, hashedPassword, "basic");
            res.redirect("/");
          } catch(err) {
            // Set the error messsage
            if (err.detail.includes('already exists')) {
                req.flash('error', `Email '${req.body.email}' already exists.`)
            }
            else{
                req.flash('error', err.detail)
            }
            
            res.redirect("/signup")
          }
    },
    post_login: (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) return next(err);
            if (!user) {
                req.flash('error', 'Invalid username or password');
                return res.redirect('/'); // login failed

            }

            req.logIn(user, (err) => {
                if (err) return next(err);

                // Success -> Bring them to the dashboard.
                // Note: You can get user role by user.status
                console.log("Logged in!");
                return res.redirect("dashboard"); // GET "dashboard"
            });
        })(req, res, next);
    },

    dashboard: (req, res) => {
        /* EXAMPLE: Current User.
            id: 3,
            username: '123',
            password: '$2b$10$JLb.YlwaAxXSbUM9jMT53eGnrsg9R/HpabU77oV7Gd7771p/CzlCe',
            email: '123',
            status: 'basic'
        */
        console.log("Here is the current user:\n", res.locals.currentUser);
        currentUser = res.locals.currentUser;
        res.render("dashboard", currentUser); // Pass the currentUser information to the dashboard.
    }
}

module.exports = controller;
