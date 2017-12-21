// app/routes.js
// const dbconfig = require('../config/database')
const mysql = require('mysql')
// var db = mysql.createConnection(dbconfig.connection);
const db = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : 'root',
	port : '8889',
	database : 'centre_culturel'
})

module.exports = function(app, passport) {

	db.connect((err)=>{
		if(err){
			throw err;
		}
		console.log('mysql ok')
	})

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});
	app.get('/admin/visiteur',(req, res)=>{
		let sql = 'SELECT * FROM visiteurs';
		let query = db.query(sql, (err, results)=>{
			if(err) throw err;
			res.render('visiteur.ejs', {visiteurs: results})
		})
		
	})
	app.get('/deleteVisiteur/:id', (req, res)=>{
		
		let sql = `DELETE FROM visiteurs WHERE id = ${req.params.id} `;
		let query = db.query(sql, (err, results)=>{
			if(err) {
				throw err;
				res.redirect('/visiteur')
					}
			res.redirect('/admin/visiteur')
		})
	})
	app.post('/addVisiteurs', (req, res)=>{
		let post = { firstname : req.body.firstname, name : req.body.name, adresse : req.body.adresse, sexe : req.body.sexe, horaire_id : '8'}
		let sql = 'INSERT INTO visiteurs SET ?';
		let query = db.query(sql, post, (err, result)=>{
			if(err) throw err;
			res.redirect('/admin/visiteur')
		} )
	})

	
	app.get('/updateVisiteur/:id', (req, res) => {
		let sql = `SELECT * FROM visiteurs WHERE id = ${req.params.id} `;
		let query = db.query(sql, (err, result) => {
			if (err) throw err;
			console.log(result)
			res.render('updateVisiteur.ejs', {
				visiteurs: result.filter((visiteur) => {
					return req.params.id == visiteur.id
				})
				[0]
			})
		})
	})
	app.post('/updateVisiteur/:id', (req, res)=>{
		let sql = `UPDATE visiteurs SET firstname = ?, name = ?, sexe = ?, adresse = ? WHERE id = ?`;
		let params = [req.body.firstname, req.body.name, req.body.sexe, req.body.adresse, req.params.id]
		let query = db.query(sql, params,(err, result)=>{
			if(err) throw err;
			res.redirect('/admin/visiteur')
		})
	})
	
	app.post('/attributions', (req, res)=>{
		let sql = 'INSERT INTO attribution SET ?';
		let params = {visiteur_id : req.body.visiteur, ordinateur_id : req.body.ordi, horaire : req.body.horaire}
		let query = db.query(sql ,params, (err, result)=>{
			console.log(result)
			if(err) throw err;
			res.redirect('/admin/attribution')
		})
	})
	app.get('/deleteAttribution/:id', (req, res)=>{
		let sql = `DELETE FROM attribution WHERE id = ${req.params.id} `;
		let query = db.query(sql, (err, results)=>{
			if(err) throw err;
			res.redirect('/admin/attribution')
		})
	})
	app.get('/admin/attribution', (req, res) => {
		let attribution = 'SELECT * FROM attribution';
		let visiteurs = 'SELECT * FROM visiteurs';
		let ordinateurs = 'SELECT * FROM ordinateur';
		let query = db.query(ordinateurs, (err, ordis) => {
			let query = db.query(attribution, (err, attributions) => {
				if (err){
					res.send('Oups relation deja crée')
				}
				let query = db.query(visiteurs, (err, visiteurs) => {
					
					res.render('attribution.ejs', { ordis: ordis, visiteurs: visiteurs, attributions: attributions })
				})
			})
		})
	})
	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});
	// process the login form
	app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/dashboard', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/dashboard', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/dashboard', isLoggedIn, function(req, res) {
		let attribution = 'SELECT * FROM attribution';
		let visiteurs = 'SELECT * FROM visiteurs';
		let ordinateurs = 'SELECT * FROM ordinateur';
		let query = db.query(ordinateurs, (err, ordis) => {
			let query = db.query(attribution, (err, attributions) => {			
				let query = db.query(visiteurs, (err, visiteurs) => {
					if (err){
						res.send('Oups relation deja crée')
					}
					res.render('dashboard.ejs', { ordis: ordis, visiteurs: visiteurs, attributions: attributions, user : req.user })
				})

			})
		})
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
