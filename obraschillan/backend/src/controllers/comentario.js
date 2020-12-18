const pool = require('../db')

const comentario = {}

comentario.getAll = (req, res) => {
    if (pool) {
        pool.query('SELECT * FROM comentario AND activo = 1', (error, result) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al cargar comentarios',
                    errors: error
                })
            } else {
                res.status(200).json({
                    success: true,
                    users: result
                })
            }
        })
    }
}

comentario.getById = (req, res) => {
  let id = req.params.id
  if(!id) return res.status(400).json({succes:false,message:'Debes proporcionar un id'})
    if (pool) {
        pool.query('SELECT * FROM comentario WHERE id = ? AND activo = 1', id, (error, result) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al obtener comentario',
                    errors: error
                })
            } else {
                if (result.length == 0) {
                    res.status(404).json({
                        success: false,
                        message: 'No se encontro comentario con el id',
                    })
                } else {
                    res.status(200).json({
                        success: true,
                        message: 'Comentario obtenido con exito',
                        user: result
                    })
                }
            }
        })
    }
}

comentario.getAllByUsuario = (req, res) => {
  let id = req.params.id
  if(!id) return res.status(400).json({succes:false,message:'Debes proporcionar un id'})
    if (pool) {
        pool.query('SELECT * FROM comentario WHERE Ciudadano_id = ? AND activo = 1', id, (error, result) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al obtener comentarios',
                    errors: error
                })
            } else {
                if (result.length == 0) {
                    res.status(404).json({
                        success: false,
                        message: 'No se encontro comentarios para el ciudadano',
                    })
                } else {
                    res.status(200).json({
                        success: true,
                        message: 'Comentarios obtenidos con exito',
                        user: result
                    })
                }
            }
        })
    }
}

comentario.getAllByReporte = (req, res) => {
  let id = req.params.id
  if(!id) return res.status(400).json({succes:false,message:'Debes proporcionar un id'})
    if (pool) {
        pool.query('SELECT * FROM comentario WHERE Reporte_id = ? AND activo = 1', id, (error, result) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al obtener comentarios',
                    errors: error
                })
            } else {
                if (result.length == 0) {
                    res.status(404).json({
                        success: false,
                        message: 'No se encontro comentarios para el reporte',
                    })
                } else {
                    res.status(200).json({
                        success: true,
                        message: 'Comentarios obtenidos con exito',
                        user: result
                    })
                }
            }
        })
    }
}

comentario.update = (req, res) => {
    if (Object.entries(req.body).length === 0) return res.status(400).json({ "error": true, "message": "No ha proporcionado datos" })
    if (pool) {
        let id = req.params.id
        let comentario = req.body
        pool.query('UPDATE comentario SET ? WHERE id = ? AND activo = 1', [comentario, id], (error, result) => {
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar',
                    errors: error
                })
            } else {
                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        success: false,
                        message: 'Comentario no encontrado'
                    })
                } else {
                    return res.status(200).json({
                        success: true,
                        message: 'Comentario actualizado con exito',
                        user: result
                    })
                }
            }
        })
    }
}

comentario.delete = (req, res) => {
    if (pool) {
        let id = req.params.id
        pool.query('UPDATE comentario SET activo = ? WHERE id = ? AND activo = 1', [0, id], (error, result) => {
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo actualizar',
                    errors: error
                })
            } else {
                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        success: false,
                        message: 'Comentario no encontrado'
                    })
                } else {
                    return res.status(200).json({
                        success: true,
                        message: 'Comentario actualizado con exito',
                        user: result
                    })
                }
            }
        })
    }
}

//Falta Crear comentario

module.exports = comentario
