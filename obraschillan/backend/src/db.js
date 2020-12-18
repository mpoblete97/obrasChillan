const mysql = require('mysql')
require('dotenv').config();
const pool = mysql.createPool({
    // host: process.env.DB_HOST,
    host: '146.83.196.204',
    // user: process.env.DB_USER,
    user: 'tamara.salgado1601',
    // password: process.env.DB_PASS,
    password: '6scYW2rkpYAU',
    // port: process.env.DB_PORT,
    port: 3307,
    // database:process.env.DB_NAME
    database: 'tamara.salgado1601'
})

pool.getConnection((err, connection)=>{
    if(err){
        if(err.code==='PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE CONNECTION WAS CLOSED')
        }
        if(err.code==='ER_CON_COUNT_ERROR'){
            console.error('DATABASE HAS TO MANY CONNECTIONS')
        }
        if(err.code==='ECONNREFUSED'){
            console.error('DATABASE CONNECTION WAS REFUSED')
        }
    }
    if(connection){ connection.release()
        console.log('DB is Connected')
    }
    return
})
module.exports = pool
