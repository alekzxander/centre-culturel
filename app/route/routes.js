// app/routes.js
// const dbconfig = require('../config/database')
const mysql = require('mysql')


const db = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : 'root',
	port : '8889',
	database : 'centre_culturel'
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
