const path = require("node:path");
const express = require("express")
const userRoutes = require('./routes/routes');
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pool = require("./Pool");
require("dotenv").config();

// 1) App config.
const app = express();
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));

// 2) App setup
app.use(session({
    store: new pgSession({
      pool : pool,
      tableName : 'session'
    }),
    secret: "cats",
    resave: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
    saveUninitialized: false,
}));

app.listen(process.env.DB_PORT, () => {
    console.log(`Server is listening on ${process.env.DB_PORT}`)
})
