//import mysql
const pool = require('../db')
const helpers = require('../lib/helpers')
const path = require('path');
require('dotenv').config();
//const = function

const ciudadano = {}

ciudadano.getAll = (req, res) => {
  if(pool){
    pool.query('SELECT * FROM ciudadano;', (error, result) =>{
      if(error){
        return res.status(500).json({
          success:false,
          message: 'Error al cargar ciudadano',
          error: error
        })
      }else{
        res.status(200).json({
          success: true,
          users: result
        })
      }
    })
  }
}

ciudadano.getById = (req,res) => {
  let id = req.params.id
  if(!id) return res.status(400).json({succes:false,message:'Debes proporcionar un id'})
  if(pool){
    pool.query('SELECT * FROM ciudadano where id=? AND activo=1', id, (error, result) =>{
      if(error){
        return res.status(500).json({
          success:false,
          message: 'Error al obtener usuario de ciudadano',
          error: error
        })
      }else{
        if(result.length == 0){
          res.status(404).json({
            success: false,
            message: 'No se encontro usuario con el id',
          })
        }else{
          console.log(result)
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

ciudadano.update = (req, res)=>{
  if(Object.entries(req.body).length===0)
    return res.status(400).json({"error": true, "message":"No ha proporcionado datos"})
    if (pool) {
    let id = req.params.id
    let user = req.body
    pool.query('SELECT contrasena FROM ciudadano WHERE id=?',id,(error, result)=>{
      if(error){
        throw error
      }else {
        console.log(user.contrasena+' ? '+result[0].contrasena)
        if(user.contrasena!=result[0].contrasena){
          user.contrasena = helpers.encrypt_password(user.contrasena)
        }
      }
      pool.query('UPDATE ciudadano SET ? WHERE id = ?', [user, id], (error, result) =>{
        if(error){
          return res.status(400).json({
            success:false,
            message: 'No se pudo actualizar',
            error: error
          })
        }else{
          if(result.affectedRows === 0){
            res.status(404).json({
              success: false,
              message: 'Usuario no encontrado',
            })
          }else{
            res.status(200).json({
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
ciudadano.delete = (req, res)=>{
  if(pool){
    let id = req.params.id
    pool.query('UPDATE ciudadano SET activo = 0 WHERE id = ?', id, (error, result) =>{
      if(error){
        return res.status(400).json({
          success:false,
          message: 'No se pudo eliminar',
          error: error
        })
      }else{
        if(result.affectedRows === 0){
          res.status(404).json({
            success: false,
            message: 'Usuario no encontrado',
          })
        }else{
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
ciudadano.insert = (req, res) => {
    //Necita recibir departamento, descripción, latitud, longitud, ciudadano_id.
    let contrasena;
    if(req.body.contrasena) {
       contrasena = helpers.encrypt_password(req.body.contrasena)
    }
    console.log(req.body.contrasena);
    if (pool) {
        let ciudadano = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            run: req.body.run,
            email: req.body.email,
            contrasena: contrasena,
            activo: 1
        }
        pool.query('INSERT INTO ciudadano SET ?', ciudadano, (error, result) => {
        if (error) {
          return res.status(400).json({
            succes: false,
            message: 'Error al crear ciudadano',
            error: error
          })
        } else {
            return res.status(201).json({
            succes: true,
            message:' Se a creado exitosamente ',
            ciudadano: ciudadano
        })
      }
    })
  }
}
ciudadano.comprobarContrasena = (req, res) => {
  var identify = {
      email: req.body.email,
      contrasena: req.body.contrasena
  }
  if (pool) {
      pool.query('SELECT * FROM ciudadano WHERE email=?', identify.email, (error, result) => {
        if(error){
          return res.status(500).json({
              success: false,
              message: 'Error al cargar ciudadano',
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
ciudadano.uploadImage =  (req, res) => {

       let id = req.params.id;
       if (!req.files) {
           return res.status(400).json({
               ok: false,
               message: 'No selecciono nada',
               error: { message: 'Debe seleccionar una imagen' }
           });
       }
       //obtener nombre del archivo
       console.log("esta"+req.files.imagen);
       var imagenes = [];
       imagenes = req.files.imagen;
       // verifico si viene un arreglo de imagenes o una sola imagen
       if(imagenes.length == undefined){
          console.log("entre")
          imagenes = [imagenes];
       }
       console.log(imagenes);
       var imagenesServidor = [];
       for ( let i=0; i<imagenes.length; i++ ){
         let archivo = imagenes[i];
         let nombreCortado = archivo.name.split('.');
         let extensionArchivo = nombreCortado[nombreCortado.length - 1];
         let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg', 'PNG', 'JPG', 'GIF', 'JPEG'];

         if (extensionesValidas.indexOf(extensionArchivo) < 0) {
             return res.status(400).json({
                 ok: false,
                 message: 'Extension no válida.'+' Las extensiones validas son ' + extensionesValidas
             });
         }
         let nombreArchivo = `${id}-${new Date().getMilliseconds()}${i}.${extensionArchivo}`;
         console.log("nombre archivo"+nombreArchivo);
         imagenesServidor[i] = nombreArchivo;
       }

       console.log(imagenesServidor);

       // GUARDAR EN BASE DE DATOS.
       if (pool) {
         for(let j = 0; j<imagenesServidor.length; j++){
         //Mover el archivos del temporal a un path
          let path = `./src/public/imagenesReportes/${imagenesServidor[j]}`;
          imagenes[j].mv(path, err => {
              if (err) {
                  return res.status(500).json({
                      success: false,
                      message: 'Error al mover archivo',
                      error: err
                  });
              }
            });
           console.log(process.env.DOMAIN)
            let imagen = {
              url: `${process.env.DOMAIN}${process.env.PORT}/imagenesReportes/`+imagenesServidor[j],
              // url: 'http://pacheco.chillan.ubiobio.cl:3000/imagenesReportes/'+imagenesServidor[j],
              idReporte: id,
              activo: 1
            }
            console.log(imagen.url);
            pool.query('INSERT INTO imagenes SET ?', imagen, (error, result) => {
              if (error) {
                return res.status(400).json({
                  success: false,
                  message: 'Error al insertar imagen',
                  error: error
                })
              }
            })
          }
        }
       return res.status(200).json({
           success: true,
           message: 'peticion realizada correctamente'
       });
   };
ciudadano.uploadImagePerfil =  (req, res) => {
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

  if (extensionesValidas.indexOf(extensionArchivo) < 0) {
    return res.status(400).json({
      ok: false,
      message: 'Extension no valida.'+' Las extensiones validas son:  ' + extensionesValidas,
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
          error: err
        });
      }
    });

    let imagen = `${process.env.DOMAIN}${process.env.PORT}/imagenesPerfil/`+nombreArchivo
    // let imagen = 'http://pacheco.chillan.ubiobio.cl:3000/imagenesPerfil/'+nombreArchivo
    console.log(imagen);
    pool.query('UPDATE ciudadano SET imagenPerfil = ? WHERE id = ?', [imagen,id], (error, result) => {
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

module.exports = ciudadano
