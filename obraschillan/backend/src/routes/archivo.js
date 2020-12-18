const express = require('express')
const router = express.Router()
const archivos = require('../controllers/archivo')

router.get('/get_archivos/:id', archivos.getByPropuesta)
router.post('/upload_archivo/:id', archivos.upload)
router.delete('/del_archivo/:id', archivos.delete)


module.exports = router
