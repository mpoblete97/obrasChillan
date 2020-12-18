const express = require('express')
const router = express.Router()
const reporte = require('../controllers/reporte')
//middleware
const auth_token = require('../lib/middleware')

router.get('/all_reportes',reporte.getAll)
router.get('/all_reportes/:id',reporte.getAll_byid)
router.get('/reportes_ciudadano/:id',reporte.getAll_byCiudadano)
router.post('/new_reporte',reporte.insert)
router.put('/update_reporte/:id',reporte.update)
router.put('/del_reporte/:id',reporte.delete)//Eliminación lógica
router.get('/get_reporte/:id',reporte.getby_id)
router.get('/get_images/:id',reporte.get_images)
router.get('/all_reportesRecepcionados',reporte.getAll_Recepcionados)
router.get('/all_reportesNoRecepcionados',reporte.getAll_noRecepcionados)
router.get('/all_reportesEnProceso',reporte.getAll_enProceso)
router.delete('/del_imagen/:id', reporte.del_imagen)
//export
module.exports = router
