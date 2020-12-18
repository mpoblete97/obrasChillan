const express = require('express')
const router = express.Router()
const costos = require('../controllers/costo')

router.get('/get_costos/:id', costos.getByPropuesta)
router.post('/new_costo', costos.insert)
router.delete('/del_costo/:id', costos.delete)


module.exports = router
