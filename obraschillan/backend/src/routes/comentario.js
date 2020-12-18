const express = require('express')
const router = express.Router()
const comentario = require('../controllers/comentario')

router.get('/all_comentario', comentario.getAll)
router.get('/get_comentario/:id', comentario.getById)
router.get('/get_comentarios_ciudadano/:id', comentario.getAllByUsuario)
router.get('/get_comentarios_reporte/:id', comentario.getAllByReporte)
router.put('/update_comentario/:id', comentario.update)
router.put('/del_comentario/:id', comentario.delete)

module.exports = router
