//import mysql
const pool = require('../db')

//const = function
const reporte = {}
reporte.getAll = (req, res) => {
  if (pool) {
    pool.query('SELECT * FROM reporte AND activo=1;', (error, results) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: 'Error al obtener reportes',
          error: error
        })
        console.log(error.message)
      } else {
        return res.status(200).json({
          success: true,
          message: 'Reportes obtenidos con éxito',
          reportes: results
        })
      }
    })
  }
}
reporte.getAll_byid = (req, res) => {
  let id = req.params.id
  if (pool) {
    pool.query('SELECT * FROM reporte WHERE Encargado_id=? AND activo = 1', id, (error, results) => {
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Error al obtener reportes',
          error: error
        })
        console.log(error.message)
      } else {
        return res.status(200).json({
          success: true,
          message: 'Reportes obtenidos con éxito',
          reportes: results
        })
      }
    })
  }
}
reporte.getAll_byCiudadano = (req,res) => {
  let id = req.params.id
  if (pool) {
    pool.query('SELECT * FROM reporte WHERE Ciudadano_id=? AND activo=1', id, (error, results) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: 'Error al obtener reportes',
          error: error
        })
        console.log(error.message)
      } else {
        return res.status(200).json({
          success: true,
          message: 'Reportes obtenidos con éxito',
          reportes: results
        })
      }
    })
  }
}
reporte.insert = (req, res) => {
  //Necesita recibir departamento, descripción, latitud, longitud, ciudadano_id.
  if (pool) {
    var date = new Date()
    console.log(date)
    pool.query('SELECT id FROM  encargado WHERE departamento=? AND activo=true', req.body.departamento, (error, results) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: 'Error del servidor',
          error: error
        })
      } else {
        let reporte = {
          fecha: date,
          descripcion: req.body.descripcion,
          razones: null,
          latitud: req.body.latitud,
          longitud: req.body.longitud,
          Encargado_id: results[0].id,
          Ciudadano_id: req.body.ciudadano_id,
          direccion: req.body.direccion
        }
        if (results.length) {
          pool.query('INSERT INTO reporte SET ?', reporte, (error, result) => {
            if (error) {
              return res.status(400).json({
                success: false,
                message: 'Error al crear reporte',
                error: error
              })
            } else {

              return res.status(201).json({
                success: true,
                message:'Reporte insertado con éxito',
                reporte: reporte,
                id: result.insertId
              })
            }
          })
        }
      }
    })
  }
}
reporte.update = (req, res) => {
  let id = req.params.id
  let reporte = req.body
  console.log(reporte)
  if (!id || !reporte) {
    return res.satus(400).json({
      success: false,
      message: 'Debes proveer id y datos de reporte',
      error: producto
    })
  }
  if (pool) {
    pool.query("SELECT * FROM reporte WHERE id=?", id, (error, result) => {
      if (error) {
        throw error
      } else {
        if (result.length && req.body.departamento!='' && req.body.departamento!=undefined) {
          console.log(req.body.departamento)
          reporte.Ciudadano_id = result[0].Ciudadano_id
          reporte.fecha = result[0].fecha
          pool.query('SELECT id FROM  encargado WHERE departamento=? AND activo=true', req.body.departamento, (error, results) =>{
            if (error) {
              return res.status(500).json({
                success: false,
                message: 'Error del servidor',
                error: error
              })
            }else {
              delete reporte.departamento
              reporte.Encargado_id = results[0].id
            }
            if (results.length){
              console.log(result.reporte)
              pool.query("UPDATE reporte SET ? WHERE id=?", [reporte, id], (error, results, fields) => {
                if (error) throw error
                else {
                  return res.status(200).json({
                    success: true,
                    message: 'El reporte con id: ' + id + ' fue actualizado.',
                    reporte: reporte
                  })
                }
              })
            } else {
              return res.status(404).json({
                success: false,
                message: 'El reporte con id: ' + id + ' no existe',
                error: error
              })
            }
          })
        }else if(result.length){
          console.log(req.body.departamento)
          delete reporte.departamento
          delete reporte.fecha
          pool.query("UPDATE reporte SET ? WHERE id=?", [reporte, id], (error, results, fields) => {
            if (error) throw error
            else {
              return res.status(200).json({
                success: true,
                message: 'El reporte con id: ' + id + ' fue actualizado.',
                reporte: reporte
              })
            }
          })
        }
      }
    })
  }
}
reporte.delete = (req, res) => {
  let id = req.params.id
  if (!id) return res.status(400).json({success: false, message: 'Debes proporcionar un id'})
  if (pool) {
    pool.query('SELECT * FROM reporte WHERE id=? AND activo=1', id, (error, result) => {
      if (error) {
        throw error
      } else {
        if (result.length) {
          let reporte = result[0]
          reporte.activo = 0
          pool.query("UPDATE reporte SET ? WHERE id=?", [reporte, id], (error, results, fields) => {
            if (error) throw error
            else {
              return res.status(200).json({
                success: true,
                message: 'El reporte con id: ' + id + ' fue eliminado',
                reporte: reporte
              })
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
reporte.getby_id = (req, res) => {
  let id = req.params.id
  if (!id) return res.status(400).json({success: false, message: 'Debes proporcionar un id'})
  if (pool) {
    pool.query('SELECT * FROM reporte WHERE id=? AND activo=1', id, (error, result) => {
      if (error) {
        throw error
      } else {
        if (result.length) {
          if (result[0].activo == 0) return res.status(404).json({
            success: false,
            message: 'El reporte con id no existe.',
            error: error
          })
          return res.status(200).json({
            success: true,
            message: 'Reporte obtenido con éxito',
            reporte: result[0]
          })
        } else {
          return res.status(404).json({
            success: false,
            message: 'El reporte con id: ' + id + ' no existe.',
            error: error
          })
        }
      }
    })
  }
}
reporte.get_images = (req, res) => {
  let id = req.params.id
  if (pool) {
    pool.query('SELECT * FROM imagenes WHERE idReporte=? AND activo=1', id, (error, result) => {
      if (error) {
        throw erorr
      } else if (result.length && result[0].activo != 0){
        console.log(result[0]+' ? '+result)
        return res.status(200).json({
          success:true,
          message:'Imagenes obtenidas con éxito',
          images:result
        })
      }else{
        return res.status(404).json({
          success: false,
          message: 'No hay imágenes asociadas al reporte',
          error: error
        })
      }
    })
  }
}

reporte.del_imagen = (req, res) => {
  let id = req.params.id
  if (pool) {
    pool.query('DELETE FROM imagenes WHERE id=? AND activo=1', id, (error, result) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: 'Error al eliminar la imagen',
          error: error
        })
      } else if (result){
        console.log(result)
        return res.status(200).json({
          success:true,
          message:'Imagenes obtenidas con éxito',
          images:result
        })
      }else{
        console.log(result)
        return res.status(404).json({
          success: false,
          message: 'No hay imágenes asociadas al reporte',
          error: error
        })
      }
    })
  }
}

reporte.getAll_Recepcionados = (req, res) => {
  if (pool) {
    pool.query('SELECT * FROM reporte WHERE estado="Recepcionado" AND activo=1;', (error, results) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: 'Error al obtener reportes Recepcionados',
          error: error
        })
        console.log(error.message)
      } else {
        return res.status(200).json({
          success: true,
          message: 'Reportes Recepcionados obtenidos con éxito',
          reportes: results
        })
      }
    })
  }
}

reporte.getAll_noRecepcionados = (req, res) => {
  if (pool) {
    pool.query('SELECT * FROM reporte WHERE estado="Ingresado" AND activo=1;', (error, results) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: 'Error al obtener reportes ingresados',
          error: error
        })
        console.log(error.message)
      } else {
        return res.status(200).json({
          success: true,
          message: 'Reportes Ingresados obtenidos con éxito',
          reportes: results
        })
      }
    })
  }
}

reporte.getAll_enProceso = (req, res) => {
  if (pool) {
    pool.query('SELECT * FROM reporte WHERE estado="En proceso" AND activo=1;', (error, results) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: 'Error al obtener reportes en proceso',
          error: error
        })
        console.log(error.message)
      } else {
        return res.status(200).json({
          success: true,
          message: 'Reportes en procesos obtenidos con éxito',
          reportes: results
        })
      }
    })
  }
}
//exports
module.exports = reporte
