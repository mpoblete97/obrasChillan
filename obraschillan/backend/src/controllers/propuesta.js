const pool = require('../db')
const propuesta = {}


propuesta.getAll = (req, res) => {
  if (pool) {
    pool.query('SELECT * FROM propuesta WHERE activo=1;', (error, results) => {
      if (error) {
        res.status(500).json({"message": "Error"})
        console.log(error.menssage)
      } else {
        res.status(200).json({
          success: true,
          message: 'Lista de propuestas',
          propuestas: results,
        })
      }
    })
  }
}

propuesta.getById = (req, res) => {
  let id = req.params.id
  if (!id) return res.status(400).json({succes: false, message: 'Debes proporcionar un id'})
  if (pool) {
    pool.query('SELECT * FROM propuesta where id=? AND activo = 1', id, (error, result) => {
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Error al obtener la propuesta',
          error: error
        })
      } else {
        if (result.length == 0) {
          res.status(404).json({
            success: false,
            message: 'No se encontro propuesta con el id',
          })
        } else {
          res.status(200).json({
            success: true,
            message: 'Porpuesta obtenida con exito',
            propuesta: result
          })
        }
      }
    })
  }
}

propuesta.update = (req, res) => {
  let id = req.params.id
  let propuesta = req.body
  if (!id || !propuesta) {
    return res.satus(400).json({
      success: false,
      message: 'Debes proveer id y datos de propuesta',
      error: producto
    })
  }
  if (pool) {
    pool.query("SELECT * FROM propuesta WHERE id=?", id, (error, result) => {
      if (error) {
        throw error
      } else {
        if (result.length) {
          propuesta.Encargado_id = result[0].Encargado_id
          propuesta.Finanzas_id = result[0].Finanzas_id
          propuesta.Reporte_id = result[0].Reporte_id
          propuesta.fecha = result[0].fecha
          pool.query('UPDATE propuesta SET ? WHERE id = ?', [propuesta, id], (error, result) => {
            if (error) {
              return res.status(400).json({
                success: false,
                message: 'No se pudo actualizar',
                error: error
              })
            } else {
              if (result.affectedRows === 0) {
                res.status(404).json({
                  success: false,
                  message: 'Propuesta no encontrada',
                })
              } else {
                res.status(200).json({
                  success: true,
                  message: 'Propuesta actualizada con exito',
                  propuesta: result
                })
              }
            }
          })
        } else {
          return res.status(404).json({
            success: false,
            message: 'El reporte con id: ' + id + ' no existe',
            error: error
          })
        }
      }
    })
  }
}

propuesta.delete = (req, res) => {
  if (pool) {
    let id = req.params.id
    pool.query('UPDATE propuesta SET activo = 0 WHERE id = ?', id, (error, result) => {
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo actualizar',
          error: error
        })
      } else {
        if (result.affectedRows === 0) {
          res.status(404).json({
            success: false,
            message: 'Usuario no encontrado',
          })
        } else {
          res.status(200).json({
            success: true,
            message: 'Usuario eliminado con exito',
            propuesta: result
          })
        }
      }
    })
  }
}

propuesta.getByEncargado = (req, res) => {
  let id = req.params.id
  if (!id) return res.status(400).json({succes: false, message: 'Debes proporcionar un id'})
  if (pool) {
    pool.query('SELECT * FROM propuesta WHERE Encargado_id = ? AND activo = 1', id, (error, result) => {
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Error al obtener la propuesta solicitado',
          error: error
        })
      } else {
        res.status(200).json({
          success: true,
          message: 'Propuesta obtenida con exito',
          propuestas: result
        })
      }
    })
  }
}

propuesta.getByFinanzas = (req, res) => {
  let id = req.params.id
  if (!id) return res.status(400).json({succes: false, message: 'Debes proporcionar un id'})
  if (pool) {
    pool.query('SELECT * FROM propuesta WHERE Finanzas_id = ? AND activo = 1', id, (error, result) => {
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Error al obtener la propuesta solicitado',
          error: error
        })
      } else {
        if (result.length == 0) {
          res.status(404).json({
            success: false,
            message: 'No se encontro propuesta con el id',
          })
        } else {
          res.status(200).json({
            success: true,
            message: 'Propuesta obtenida con exito',
            propuestas: result
          })
        }
      }
    })
  }
}

propuesta.getByReporte = (req, res) => {
  let id = req.params.id
  if (!id) return res.status(400).json({succes: false, message: 'Debes proporcionar un id'})
  if (pool) {
    pool.query('SELECT * FROM propuesta WHERE Reporte_id = ? AND activo =1', id, (error, result) => {
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Error al obtener la propuesta solicitado',
          error: error
        })
      } else {
        if (result.length == 0) {
          res.status(404).json({
            success: false,
            message: 'No se encontro propuesta con el id',
          })
        } else {
          res.status(200).json({
            success: true,
            message: 'Propuesta obtenida con exito',
            propuesta: result
          })
        }
      }
    })
  }
}
propuesta.insert = (req, res) => {
  if (pool) {
    let fechaHoy = new Date()
    let prop = {
      idPropuesta: req.body.idPropuesta,
      tipo: req.body.tipo,
      descripcion: req.body.descripcion,
      razones: null,
      Encargado_id: req.body.Encargado_id,
      Reporte_id: req.body.Reporte_id,
      Finanzas_id: null,
      activo: true,
      fecha: fechaHoy
    }
    pool.query('INSERT INTO propuesta SET ?', prop, (error, result) => {
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Error al crear propuesta',
          error: error
        })
      } else {
        return res.status(201).json({
          success: true,
          message: ' Se a creado la propuesta exitosamente',
          propuesta: propuesta,
          id: result.insertId
        })
      }
    })
  }
}

module.exports = propuesta
