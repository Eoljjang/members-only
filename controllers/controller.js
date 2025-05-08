// This controller is for 'basic' users. They get less functionality.
const db = require("../db/queries");
const bcrypt = require('bcryptjs');
const passport = require("passport");
const { body, validationResult } = require('express-validator');


const controller ={
    home: (req, res) => {
        res.render("login");
    },
    nav_signup: (req, res) => {
        res.render("signup");
    },
    post_signup: async (req, res, next) => {
        // 1) Run Validators
        // await body('password')
        // .isLength({ min: 5 })
        // .withMessage('Password must be at least 5 characters long')
        // .run(req);

        await body('confirmPassword')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords do not match')
        .run(req);

        // 2) Collect any validation errors & flash them.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(err => err.msg);
            req.flash('error', errorMessages);
            return res.redirect('/signup');
        }

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
    },

    upgrade_status: async(req, res, next) => {
        // Run validator
        await body('input-upgrade')
        .custom((value, { req }) => value === process.env.UPGRADE_CODE)
        .withMessage('Incorect password to become a member :(')
        .run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('error')
            const errorMessages = errors.array().map(err => err.msg);
            req.flash('error', errorMessages); 
            res.redirect('/dashboard')
        }

        // Else: Make a db query to update that user.
        else{
            db.upgrade_user(res.locals.currentUser.email)
            console.log("CORRECT")
            req.flash('success', 'You are now a member! :)')
            res.redirect('/dashboard')
        }
    },

    logout: (req, res, next) => {
        req.logout(function (e) { // Passport handles removing the session and stuff.
            if (e) {
                return next(e);
            }
            res.redirect('/') // Back to login page.
        })
    },

    postMessage: (req, res, next) => {
        const { messageTitle, messageContent } = req.body;
        db.post_message(res.locals.currentUser, messageTitle, messageContent)
        res.redirect('/dashboard')
    },
}

module.exports = controller;
