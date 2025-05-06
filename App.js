const path = require("node:path");
const express = require("express")
const routes = require('./routes/routes');
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pool = require("./Pool");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const flash = require('connect-flash') // Used for displaying status messages like invalid username.
require("dotenv").config();

// 1) App config.
const app = express();
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: false}));

// 2) Session Store
app.use(session({
    store: new pgSession({
      pool : pool,
      tableName : 'session'
    }),
    secret: "cats",
    resave: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
    saveUninitialized: true,
}));

// 2.2) Setup Flash Middlewares (pass short status messages)
app.use(flash());
app.use((req, res, next) => {
  res.locals.error = req.flash('error'); // "error" variable is now accessible in ejs.
  res.locals.success = req.flash('success'); // "success" variable is now accessible in ejs.
  next();
});

// 3) Authentication Settings
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email', // tell passport to use 'email' instead of 'username'
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        const user = rows[0];

        if (!user) {
          return done(null, false, { message: "Incorrect email" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          return done(null, false, { message: "Incorrect Password." });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);
passport.serializeUser((user, done) => { // Creates session cookie if auth succeeds.
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => { // Gets cookie data.
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];

    done(null, user);
  } catch(err) {
    done(err);
  }
});

app.use(passport.session());

app.use((req, res, next) => {
	res.locals.currentUser = req.user; // This is provided to you by passport upon successfully authentication.
	next();
});

// 3) Routes
app.use('/', routes)

// Start the server. Note that the server & db ports are different.
app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is listening on ${process.env.SERVER_PORT}`)
})
