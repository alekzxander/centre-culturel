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
	
    
}