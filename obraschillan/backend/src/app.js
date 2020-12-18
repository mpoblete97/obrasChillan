//Requires
const auth_token = require('../src/lib/middleware')
const express = require('express'),
    bodyParser = require('body-parser'),
    jwt = require('jsonwebtoken');
require('dotenv').config();
const cors = require('cors')
const fileUpload = require('express-fileupload');
//const multipart = require('connect-multipart');
const morgan = require('morgan')
const path = require('path')
require('dotenv').config()
//Inicializar Variables
var app = express()
NODE_TLS_REJECT_UNAUTHORIZED='0'
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())
//CORS
app.use(function (req, res, next) {
    //Enabling Cords
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-cliente-token, x-client-secret, Authorization");
    next();
});
//Configuraciones
app.set('port', process.env.LISTEN_PORT||3000)
//Miiddlewares
app.use(morgan('dev'))
//Global variables
app.use((req,res,next)=>{
    next();
})
//Public
app.use(express.static(path.join(__dirname, '/public')))
//Routes
app.use(require('./routes/auth'))
app.use('/',auth_token.authenticate)
app.use(require('./routes/reporte'))
app.use(require('./routes/finanzas'))
app.use(require('./routes/encargado'))
app.use(require('./routes/propuesta'))
app.use(require('./routes/comentario'))
app.use(require('./routes/ciudadano'))
app.use(require('./routes/costo'))
app.use(require('./routes/archivo'))
//404 page
// app.use((req,res)=>{
//     res.type('text/plain')
//     res.status(404)
//     res.send('404 - Not Found')
// })
//500 page
app.use((err,req,res, next)=>{
    console.error(err.stack)
    res.type('text/plain')
    res.status(500)
    res.send('500 - Server Error')
})

//Listen
app.listen(app.get('port'), () => {
    console.log('Express started on '+app.get('port'))
})
