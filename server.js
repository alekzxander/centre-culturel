// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var session  = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app      = express();
var port     = process.env.PORT || 8080;

var passport = require('passport');
var flash    = require('connect-flash');
var connexion = require('./app/route/connexion');
var attribution = require('./app/route/attribution');
var route = require('./app/route/routes.js');
var visiteur = require('./app/route/visiteur')
// configuration ===============================================================
// connect to our database



// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

app.set('view engine', 'ejs'); // set up ejs for templating
app.set('views', __dirname + '/views');
app.use('/css', express.static(__dirname+'/public/css'));
app.use(express.static(__dirname + '/public'));  // search all ressources 


// required for passport
app.use(session({
	secret: 'vidyapathaisalwaysrunning',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
require('./config/passport')(passport); // pass passport for configuration
//route
route(app, passport);
attribution(app, passport);
connexion(app, passport);
visiteur(app, passport);

// routes ======================================================================
(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);

app.use((req, res) => {
	res.status(404).render('page404.ejs')
})
