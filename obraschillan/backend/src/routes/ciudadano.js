const express = require('express')
const router = express.Router()
const ciudadano = require('../controllers/ciudadano')

router.get('/all_ciudadano', ciudadano.getAll)
router.get('/get_ciudadano/:id', ciudadano.getById)
router.put('/update_ciudadano/:id', ciudadano.update)
router.put('/del_ciudadano/:id', ciudadano.delete)
router.post('/new_ciudadano',ciudadano.insert)
router.post('/verificarConCiudadano', ciudadano.comprobarContrasena)
router.post('/uploadImage/:id', ciudadano.uploadImage)
router.put('/imagePerfilCiudadano/:id', ciudadano.uploadImagePerfil)
module.exports = router
