// config/database.js
const dotEnv = require('dotenv').load();

module.exports = {
    'connection': {
        'host': process.env.HOST,
        'user': process.env.USER,
        'password': process.env.PASSWORD ,
        'port' : '3306',
    },
    'users_table': 'users',
    'database': ' ddhujw9g6s8wm26t'
    
};