const express = require('express')
const router = express.Router()
const finanzas = require('../controllers/finanzas')

router.get('/all_finanzas', finanzas.getAll)
router.get('/get_finanza/:id', finanzas.getById)
router.put('/update_finanza/:id', finanzas.update)
router.put('/del_finanza/:id', finanzas.delete)
router.put('/imagePerfilFinanzas/:id', finanzas.uploadImagePerfil)
router.post('/verificarConFinanzas', finanzas.comprobarContrasena)


module.exports = router
