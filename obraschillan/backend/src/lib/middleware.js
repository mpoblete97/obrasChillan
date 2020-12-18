var jwt = require('jwt-simple')
var moment = require('moment')
var jwt_decode = require('jwt-decode')
const auth = require('../controllers/auth');
require('dotenv').config();
var auth_token = {}

auth_token.authenticate = function(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).json({
            success: false,
            message: 'La petición no se pude realizar',
            error: 'Falta token/cabecera de autorización'
        })
    }
    var token = req.headers.authorization.split(" ")[1];
    var payload = jwt_decode(token, process.env.MASTER_KEY)

    if (payload.exp <= moment().unix()) {
        return res.status(401).json({
            success: false,
            message: 'Solicitud fuera de tiempo',
            error: 'La autorización/token ha expirado'
        })
    }
    req.user = payload.sub
    next()
}

module.exports = auth_token
