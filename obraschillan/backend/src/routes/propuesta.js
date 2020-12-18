const express = require('express')
const router = express.Router()
const propuesta = require('../controllers/propuesta')


router.get('/all_propuesta',propuesta.getAll)
router.get('/get_propuesta/:id', propuesta.getById)
router.get('/get_by_encargado/:id', propuesta.getByEncargado)
router.get('/get_by_finanzas/:id', propuesta.getByFinanzas)
router.get('/get_by_reporte/:id', propuesta.getByReporte)
router.post('/new_propuesta', propuesta.insert)
router.put('/update_propuesta/:id', propuesta.update)
router.put('/del_propuesta/:id', propuesta.delete)



module.exports = router
