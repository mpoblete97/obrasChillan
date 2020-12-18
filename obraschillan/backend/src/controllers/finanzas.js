//import mysql
const pool = require('../db')
const helpers = require('../lib/helpers')
    //const = function
const finanzas = {}

finanzas.getAll = (req, res) => {
    if (pool) {
        pool.query('SELECT * FROM finanzas;', (error, result) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al cargar finanzas',
                    error: error
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

finanzas.getById = (req, res) => {
  let id = req.params.id
  if(!id) return res.status(400).json({succes:false,message:'Debes proporcionar un id'})
    if (pool) {
        pool.query('SELECT * FROM finanzas WHERE id=? AND activo = 1', id, (error, result) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al obtener usuario de finanzas',
                    errors: error
                })
            } else {
                if (result.length == 0) {
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
    }
}

finanzas.update = (req, res) => {
    if (Object.entries(req.body).length === 0) return res.status(400).json({ "error": true, "message": "No ha proporcionado datos" })
    if (pool) {
      let id = req.params.id
      let user = req.body
      let contrasena = user.contrasena;
      pool.query('SELECT contrasena FROM finanzas WHERE id=?',id,(error, result)=>{
        if(error){
          throw error
        }else{
          console.log("contrasena nueva: "+user.contrasena)
          console.log("contrasena actual: "+result[0].contrasena)
          if(contrasena!=result[0].contrasena){
            console.log("entre a contrasena")
            contrasena = helpers.encrypt_password(user.contrasena)
            user.contrasena = contrasena;
            console.log("contrasena encriptada: "+user.contrasena)
          }
        }
        pool.query('UPDATE finanzas SET ? WHERE id = ?', [user, id], (error, result) => {
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
                          message: 'Usuario no encontrado'
                      })
                  } else {
                      return res.status(200).json({
                          success: true,
                          message: 'Usuario actualizado con exito',
                          user: result
                      })
                  }
              }
          })
      })
    }

}

finanzas.delete = (req, res) => {
    if (pool) {
        let id = req.params.id
        pool.query('UPDATE finanzas SET activo = ? WHERE id = ?', [0, id], (error, result) => {
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'No se pudo eliminar',
                    errors: error
                })
            } else {
                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        success: false,
                        message: 'Usuario no encontrado'
                    })
                } else {
                    return res.status(200).json({
                        success: true,
                        message: 'Usuario eliminado con exito',
                        user: result
                    })
                }
            }
        })
    }
}


finanzas.comprobarContrasena = (req, res) => {
  var identify = {
      email: req.body.email,
      contrasena: req.body.contrasena
  }
  if (pool) {
      pool.query('SELECT * FROM finanzas WHERE email=?', identify.email, (error, result) => {
        if(error){
          return res.status(500).json({
              success: false,
              message: 'Error al cargar finanzas',
              errors: error
          })
        }else{
          if (!result.length) {
              return res.status(201).json({
                  success: false,
                  message: 'Credenciales Incorrectas . Email',
                  errors: error
              })
          }else{
            if (!helpers.match_password(identify.contrasena, result[0].contrasena)) {
                return res.status(201).json({
                    success: false,
                    message: 'Credenciales Incorrectas - Contraseña',
                    errors: error
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

finanzas.uploadImagePerfil =  (req, res) => {
  let id = req.params.id;
  if (!req.files) {
    return res.status(400).json({
      success: false,
      message: 'No selecciono nada',
      errors: { message: 'Debe seleccionar una imagen' }
    });
  }
  //obtener nombre del archivo
  let archivo = req.files.imagen;
  let nombreCortado = archivo.name.split('.');
  let extensionArchivo = nombreCortado[nombreCortado.length - 1];

  // solo estas estenciones aceptamos

  let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
  console.log(extensionArchivo)
  if (extensionesValidas.indexOf(extensionArchivo) < 0) {
    return res.status(400).json({
      success: false,
      message: 'Extensión no válida.'+' Las extensiones válidas son ' + extensionesValidas
    });
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
          errors: err
        });
      }
    });

    let imagen = `${process.env.DOMAIN}${process.env.PORT}/imagenesPerfil/`+nombreArchivo
    // let imagen = 'http://pacheco.chillan.ubiobio.cl:3000/imagenesPerfil/'+nombreArchivo
    console.log(imagen);
    pool.query('UPDATE finanzas SET imagenPerfil = ? WHERE id = ?', [imagen,id], (error, result) => {
      if (error) {
        return res.status(400).json({
          success: false,
          message: 'Error al actualizar imagen',
          errors: error
        })
      }
    })
  }
  return res.status(200).json({
    success: true,
    message: 'peticion realizada correctamente'
  });
};

module.exports = finanzas
