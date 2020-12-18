//Lo relativo al inicio de sesión o registro
const auth = require('../controllers/auth')
const auth_token = require('../lib/middleware')
const express = require('express'), bodyparser = require('body-parser');
//
const router = express.Router()
router.use(bodyparser.json())
router.use(bodyparser.urlencoded({extended:true}))

router.post('/new_user', auth.register)
router.post('/login', auth.login)
router.post('/loginCiudadano', auth.ciudadano)
router.post('/forgot_password/', auth.forgot)
router.post('/verify/', auth.verify)
router.post('/inicioGoogle', auth.entrarGoogle)
router.post('/comprobarEmail/', auth.comprobarEmail)
router.post('/contacto', auth.contacto)
router.post('/sendEmail', auth.sendEmail)
router.post('/change_pass',auth_token.authenticate, auth.change)



module.exports = router
