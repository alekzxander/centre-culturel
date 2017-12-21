// app/routes.js
// const dbconfig = require('../config/database')
const mysql = require('mysql')
const dotEnv = require('dotenv').load();


const db = mysql.createConnection({
	host : process.env.HOST,
	user: process.env.USER,
	password: process.env.PASSWORD ,
	port : '3306',
	database : 'ddhujw9g6s8wm26t'
})


module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		res.render('index.ejs'); // load the index.ejs file
	});

	app.get('/dashboard', function(req, res) {
		let attribution = 'SELECT * FROM attribution';
		let visiteurs = 'SELECT * FROM visiteurs';
		let ordinateurs = 'SELECT * FROM ordinateur';
		let query = db.query(ordinateurs, (err, ordis) => {
			let query = db.query(attribution, (err, attributions) => {			
				let query = db.query(visiteurs, (err, visiteurs) => {
					if (err){
						res.send('Oups relation deja crée')
					}
					res.render('dashboard.ejs', { ordis: ordis, visiteurs: visiteurs, attributions: attributions})
				})

			})
		})
	});

	 
}
