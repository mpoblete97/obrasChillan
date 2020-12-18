const pool = require('../db')
require('dotenv').config();
const archivos = {}

archivos.upload = (req, res) => {
  let id = req.params.id;
  if (!req.files) {
    return res.status(400).json({
      ok: false,
      message: 'No selecciono nada',
      error: {message: 'Debe seleccionar una imagen'}
    });
  }
  //obtener nombre del archivo
  console.log("esta" + req.files.archivo);
  var archivos = [];
  archivos = req.files.archivo;
  // verifico si viene un arreglo de imagenes o una sola imagen
  if (archivos.length == undefined) {
    archivos = [archivos];
  }
  var archivosServidor = [];
  for (let i = 0; i < archivos.length; i++) {
    let archivo = archivos[i];
    let nombreCortado = archivo.name.split('.');
    let extensionArchivo = nombreCortado[nombreCortado.length - 1];
    let extensionesValidas = ['pdf','doc','docx','xlsx'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
      return res.status(400).json({
        ok: false,
        message: 'Extension no válida.'+' Las extensiones validas son ' + extensionesValidas
      });
    }
    let nombreArchivo = `${nombreCortado[0]}_${id}-${new Date().getMilliseconds()}${i}.${extensionArchivo}`;
    console.log("nombre archivo" + nombreArchivo);
    archivosServidor[i] = nombreArchivo;
  }

  console.log(archivosServidor);

  // GUARDAR EN BASE DE DATOS.
  if (pool) {
    for (let j = 0; j < archivosServidor.length; j++) {
      //Mover el archivos del temporal a un path
      let path = `./src/public/ArchivosPropuesta/${archivosServidor[j]}`;
      archivos[j].mv(path, err => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Error al mover archivo',
            error: err
          });
        }
      });
      let archivo = {
        url: `${process.env.DOMAIN}${process.env.PORT}/ArchivosPropuesta/` + archivosServidor[j],
        // url: 'http://pacheco.chillan.ubiobio.cl:3000/ArchivosPropuesta/' + archivosServidor[j],
        activo: 1,
        id_propuesta: id
      }
      console.log(archivo.url);
      pool.query('INSERT INTO archivos SET ?', archivo, (error, result) => {
        if (error) {
          return res.status(400).json({
            success: false,
            message: 'Error al insertar archivo',
            error: error
          })
        }
      })
    }
    return res.status(200).json({
      success: true,
      message: 'peticion realizada correctamente'
    });
  }
}
archivos.getByPropuesta = (req, res) => {
  let id = req.params.id
  if (!id) return res.status(400).json({succes: false, message: 'Debes proporcionar un id'})
  if (pool) {
    console.log(id)
    pool.query('SELECT * FROM archivos WHERE id_propuesta= ?', id, (error, result) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: 'Error al obtener archivos de propuesta con id:' + id,
          error: error
        })
      } else {
        return res.status(200).json({
          success: true,
          message: 'Archivos obtenidos con éxitos para propuesta con id:' + id,
          archivos: result
        })
      }
    })
  }
}

archivos.delete = (req, res) => {
  if (pool) {
    let id = req.params.id
    pool.query('DELETE from archivos WHERE id = ?', id, (error, result) => {
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
            message: 'archivo no encontrado',
          })
        } else {
          res.status(200).json({
            success: true,
            message: 'archivo eliminado con exito',
            propuesta: result
          })
        }
      }
    })
  }
}

module.exports = archivos
