//import mysql
const pool = require('../db')
const helpers = require('../lib/helpers')
//const = function
const encargado = {}

encargado.getAll = (req, res) => {
  if (pool) {
    pool.query('SELECT * FROM encargado;', (error, results) => {
      if (error) {
        res.status(500).json({ "Mensaje": "Error" })
        console.log(error.menssage)
      } else {
        res.status(200).json({ "Lista de Encargados": results })
      }
    })
  }
}


encargado.getById = (req, res) => {
  let id = req.params.id
  if(!id) return res.status(400).json({succes:false,message:'Debes proporcionar un id'})
  if (pool) {
    pool.query('SELECT * FROM encargado where id=? AND activo = 1', id, (error, result) => {
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Error al obtener usuario de encargado',
          error: error
        })
      } else {
        if (result.length === 0) {
          res.status(404).json({
            success: false,
            message: 'No se encontro usuario con el id',
          })
        } else {
          res.status(200).json({
            success: true,
            message: 'Usuario obtenido con exito',
            user: result
          })
        }
      }
    })
  } else {
    if (result.length === 0) {
      res.status(404).json({
        succes: false,
        message: 'No se encontro usuario con el id',
      })
    } else {
      res.status(200).json({
        succes: true,
        message: 'Usuario obtenido con exito',
        user: result[0]
      })
    }
  }
}



encargado.update = (req, res) => {
  if (Object.entries(req.body).length === 0)
    return res.status(400).json({ "error": true, "message": "No ha proporcionado datos" })
    if (pool) {
    let id = req.params.id
    let user = req.body
    pool.query('SELECT contrasena FROM encargado WHERE id=?',id,(error, result)=>{
      if(error){
        throw error
      }else {
        console.log(user.contrasena+' ? '+result[0].contrasena)
        if(user.contrasena!=result[0].contrasena){
          user.contrasena = helpers.encrypt_password(user.contrasena)
        }
      }
      pool.query('UPDATE encargado SET ? WHERE id = ?', [user, id], (error, result) => {
        if (error) {
          return res.status(400).json({
            succes: false,
            message: 'No se pudo actualizar',
            error: error
          })
        } else {
          if (result.affectedRows === 0) {
            res.status(404).json({
              succes: false,
              message: 'Usuario no encontrado',
            })
          } else {
            res.status(200).json({
              succes: true,
              message: 'Usuario actualizado con exito',
              user: result[0]
            })
          }
        }
      })
    })
  }
}

  encargado.delete = (req, res) => {
    if (pool) {
      let id = req.params.id
      pool.query('UPDATE encargado SET activo = 0 WHERE id = ?', id, (error, result) => {
        if (error) {
          return res.status(400).json({
            succes: false,
            message: 'No se pudo eliminar',
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
              user: result
            })
          }
        }
      })
    }
  }

  encargado.comprobarContrasena = (req, res) => {
    var identify = {
        email: req.body.email,
        contrasena: req.body.contrasena
    }
    if (pool) {
        pool.query('SELECT * FROM encargado WHERE email=?', identify.email, (error, result) => {
          if(error){
            return res.status(500).json({
                success: false,
                message: 'Error al cargar encargado',
                error: error
            })
          }else{
            if (!result.length) {
                return res.status(201).json({
                    success: false,
                    message: 'Credenciales Incorrectas . Email',
                    error: error
                })
            }else{
              if (!helpers.match_password(identify.contrasena, result[0].contrasena)) {
                  return res.status(201).json({
                      success: false,
                      message: 'Credenciales Incorrectas - Contraseña',
                      error: error
                  })
              } else {
                  return res.status(200).json({
                      success: true,
                      message: 'Contraseña es correcta',
                      user: result[0]
                  })
              }
            }
          }
        })
     }
  }
encargado.uploadImagePerfil =  (req, res) => {
  let id = req.params.id;
  if (!req.files) {
    return res.status(400).json({
      success: false,
      message: 'No selecciono nada',
      error: { message: 'Debe seleccionar una imagen' }
    });
  }
  //obtener nombre del archivo
  let archivo = req.files.imagen;
  let nombreCortado = archivo.name.split('.');
  let extensionArchivo = nombreCortado[nombreCortado.length - 1];

  // solo estas estenciones aceptamos

  let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
  console.log(extensionArchivo)
  console.log(archivo)
  if (extensionesValidas.indexOf(extensionArchivo) < 0) {
    return res.status(400).json({
      success: false,
      message: 'Extension no válida. '+' Las extensiones válidas son ' + extensionesValidas
    })
  }

  //nombre de archivo personalizado
  let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

  if(pool){
    //Mover el archivos del temporal a un path
    let path = `./src/public/imagenesPerfil/${nombreArchivo}`;
    console.log(path);
    archivo.mv(path, err => {
      if (err) {
        return res.status(500).json({
          ok: false,
          message: 'Error al mover archivo',
          error: err
        });
      }
    });

    let imagen = `${process.env.DOMAIN}${process.env.PORT}/imagenesPerfil/`+nombreArchivo
    // let imagen = 'http://pacheco.chillan.ubiobio.cl:3000/imagenesPerfil/'+nombreArchivo
    console.log(imagen);
    pool.query('UPDATE encargado SET imagenPerfil = ? WHERE id = ?', [imagen,id], (error, result) => {
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Error al actualizar imagen',
          error: error
        })
      }
    })
  }
  return res.status(200).json({
    success: true,
    message: 'peticion realizada correctamente'
  });
};
  //exports
  module.exports = encargado
