const mysql = require('mysql')
const dotEnv = require('dotenv').load();
const isLoggedIn = require('./connexion')


const db = mysql.createConnection(process.env.JAWSDB_URL)
module.exports = function(app, passport) {
  
   
    app.post('/attributions',isLoggedIn, (req, res)=>{
		let sql = 'INSERT INTO attribution SET ?';
		let params = {visiteur_id : req.body.visiteur, ordinateur_id : req.body.ordi, horaire : req.body.horaire}
		let query = db.query(sql ,params, (err, result)=>{
			if(err){
				res.redirect('/admin/attribution')
			} 
			res.redirect('/admin/attribution')
		})
	})
	app.get('/deleteAttribution/:id',isLoggedIn, (req, res)=>{
		let sql = `DELETE FROM attribution WHERE id = ${req.params.id} `;
		let query = db.query(sql, (err, results)=>{
			if(err) throw err;
			res.redirect('/admin/attribution')
		})
	})
	app.get('/admin/attribution',isLoggedIn, (req, res) => {
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
}