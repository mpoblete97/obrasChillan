const express = require('express')
const router = express.Router()
const encargado = require('../controllers/encargado')

router.get('/all_encargado',encargado.getAll)
router.get('/get_encargado/:id', encargado.getById)
router.put('/update_encargado/:id', encargado.update)
router.put('/del_encargado/:id', encargado.delete)
router.post('/verificarConEncargado', encargado.comprobarContrasena)
router.put('/imagePerfilEncargado/:id', encargado.uploadImagePerfil)

module.exports = router
