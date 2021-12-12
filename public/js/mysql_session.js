const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const bodyParser = require("body-parser");

var app = express();

app.use(session({
    secret: 'secretHanda',
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore({
        host: '3.35.53.206',
    port: 3306,
    user: 'handa',
    password: '1234',
    database: 'handa'
    })
}));

app.use(bodyParser.urlencoded({ extended: false}))