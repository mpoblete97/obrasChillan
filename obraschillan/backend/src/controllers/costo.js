//import mysql
const pool = require('../db')
    //const = function

const costos = {}

costos.insert = (req, res) => {
    if (pool) {
        let costo = {
            detalle: req.body.detalle,
            costo_unitario: req.body.costo_unitario,
            cantidad: req.body.cantidad,
            id_propuesta: req.body.id_propuesta
        }
        pool.query('INSERT INTO costos SET ?', costo, (error, result) => {
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Error al crear costo',
                    error: error
                })
            } else {
                return res.status(200).json({
                    success: true,
                    message: 'Costo creado con éxito',
                    costo: costo
                })
            }
        })
    }
}

costos.getByPropuesta = (req, res) => {
    let id = req.params.id
    if (!id) return res.status(400).json({ succes: false, message: 'Debes proporcionar un id' })
    if (pool) {
        pool.query('SELECT * FROM costos WHERE id_propuesta=?', id, (error, result) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al obtener costos de propuesta con id:' + id,
                    errors: error
                })
            } else {
                console.log(result)
                return res.status(200).json({
                    success: true,
                    message: 'Costos obtenidos con éxitos para propuesta con id:' + id,
                    costos: result
                })
            }
        })
    }
}

costos.delete = (req, res) => {
  if (pool) {
    let id = req.params.id
    pool.query('DELETE from costos WHERE id = ?', id, (error, result) => {
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo eliminar',
          error: error
        })
      } else {
        if (result.affectedRows === 0) {
          res.status(404).json({
            success: false,
            message: 'costo no encontrado',
            result: result
          })
        } else {
          res.status(200).json({
            success: true,
            message: 'costo eliminado con exito',
            propuesta: result
          })
        }
      }
    })
  }
}

module.exports = costos
