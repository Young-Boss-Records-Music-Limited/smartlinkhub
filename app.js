const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const uuid = require('uuid/v4')
require('dotenv').config();
const hbs = require('express-handlebars');
const session      = require('express-session');
const passport = require('./config/passport');
const busboy = require('connect-busboy');
const busboyBodyParser = require('busboy-body-parser');


const app = express();
const PORT = process.env.PORT;


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(busboyBodyParser());
app.engine( 'hbs', hbs( { 
    extname: 'hbs', 
    defaultLayout: __dirname + '/views/layouts/main.hbs',
    partialsDir: __dirname + '/views/partials',
    layoutsDir: __dirname + '/views/layouts'
  } ) );
  
  app.set( 'view engine', 'hbs' );

hbs.registerHelper('userinfo', function() { 
    if(!req.user){return 'login';}
    else{ return req.user}
  });


app.use(express.static("public"));
app.use(busboy()); 

app.use(session({
    key: process.env.KEY,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:{ 
        expires: 6000000000000000,
    }
}));



app.use(passport.initialize());
app.use(passport.session()); 

const indexRouter = require('./routes/index');
const filesRouter = require('./routes/awsfiles');

// routes for the app
app.use('/', indexRouter);
app.use('/mp3', filesRouter);

// set the app to listen on the port
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});