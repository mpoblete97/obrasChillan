//import mysql
const pool = require('../db')
//express
const express = require('express'),
    jwt = require('jsonwebtoken')
const app = express()
//bcrypt
const helpers = require('../lib/helpers')
//env
require('dotenv').config();
//jwt key
//app.set('key', processenv.MASTER_KEY)
//reset_password
const nodemailer = require('nodemailer')
//code generator
const generator = require('crypto-random-string')
//decoder jwt
const jwt_decoder = require('jwt-decode')
//moment
const moment = require('moment')
//const = function
const auth = {}
//Google
const { OAuth2Client } = require('google-auth-library')
const GOOGLE_ID = '844797839333-2d5semr3ivr2k4ksriq0eqsbkb8pp0tf.apps.googleusercontent.com'

auth.register = (req, res) => {
    if (Object.entries(req.body).length === 0) return res.status(400).json({ "error": true, "message": "No ha proporcionado datos" })
    if (pool) {
        let user = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            run: req.body.run,
            email: req.body.email,
            contrasena: helpers.encrypt_password(req.body.contrasena)
        }
        pool.query('INSERT INTO ciudadano SET ?', user, (error, results) => {
            if (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Error al crear usuario',
                    error: error
                })
            } else {
                res.status(201).json({
                    success: true,
                    user: user
                })
            }
        })
    }
}

auth.ciudadano = (req,res) =>{
  if(pool){
    var identify = {
      email: req.body.email,
      contrasena: req.body.contrasena
    }
    console.log(identify)
    pool.query('SELECT * FROM ciudadano WHERE email=?', identify.email, (error, result) => {
      if(!result.length){
        return res.status(400).json({
          success: false,
          message: 'Credenciales Incorrectas . Email',
          error: error
        })
      }else{
        if(result[0].activo===0) return res.status(400).json({success:false, message:'Credenciales Incorrectas',error:error})
        if (!helpers.match_password(identify.contrasena, result[0].contrasena)) {
          return res.status(400).json({
            success: false,
            message: 'Credenciales Incorrectas - Contraseña',
            error: error
          })
        } else {
          return res.status(200).json({
            success: true,
            message: 'Sesión iniciada con éxito',
            token: helpers.create_token(result.email, 120),
            user: result[0],
            type: 'ciudadano'
          })
        }
      }
    })
  }
}


auth.login = (req, res) => {
    console.log("LOGIN")
    if (pool) {
        var identify = {
            email: req.body.email,
            contrasena: req.body.contrasena
        }
        pool.query('SELECT * FROM finanzas WHERE email=?', identify.email, (error, result) => {
            if (error) {
                return res.status(500).json({
                    success: false,
                    message: 'Error al obtener usuario',
                    error: error
                })
            } else {
                //Si devuelve tupla respondo, si no hago consulta anidada
                if (!result.length) {
                    pool.query('SELECT * FROM encargado WHERE email=?', identify.email, (error2, result2) => {
                        if (error2) {
                            return res.status(500).json({
                                success: false,
                                message: 'Error al obtener usuario',
                                error: error2
                            })
                        } else {
                            //Si devuelve tupla respondo, si consulto anidado
                            if (!result2.length) {
                                pool.query('SELECT * FROM ciudadano WHERE email=?', identify.email, (error3, result3) => {
                                    if (error3) {
                                        return res.status(500).json({
                                            success: false,
                                            message: 'Error al obtener usuario',
                                            error: error3
                                        })
                                    } else {
                                        if (!result3.length) {
                                            return res.status(400).json({
                                                success: false,
                                                message: 'Credenciales Incorrectas . Email',
                                                error: error3
                                            })
                                        } else {
                                            if(result3[0].activo===0) return res.status(400).json({success:false, message:'Credenciales Incorrectas',error:error3})
                                            if (!helpers.match_password(identify.contrasena, result3[0].contrasena)) {
                                                return res.status(400).json({
                                                    success: false,
                                                    message: 'Credenciales Incorrectas - Contraseña',
                                                    error: error3
                                                })
                                            } else {

                                                return res.status(200).json({
                                                    success: true,
                                                    message: 'Sesión iniciada con éxito',
                                                    token: helpers.create_token(result3[0].email, 120),
                                                    user: result3[0],
                                                    type: 'ciudadano'
                                                })
                                            }
                                        }
                                    }
                                }) //Final mc ciudadano
                            } else {
                                if (!result2.length) {
                                    return res.status(400).json({
                                        success: false,
                                        message: 'Credenciales Incorrectas . Email',
                                        errors: error2
                                    })
                                } else {
                                    if(result2[0].activo===0) return res.status(400).json({success:false, message:'Credenciales Incorrectas',errors:error2})
                                    if (!helpers.match_password(identify.contrasena, result2[0].contrasena)) {
                                        return res.status(400).json({
                                            success: false,
                                            message: 'Credenciales Incorrectas - Contraseña',
                                            errors: error2
                                        })
                                    } else {

                                        return res.status(200).json({
                                            success: true,
                                            token: helpers.create_token(result2[0].email, 120),
                                            message: 'Usuario obtenido con éxito',
                                            user: result2[0],
                                            type: 'encargado'
                                        })
                                    }
                                }
                            }
                        }
                    })//Fin mc encargado
                } else {
                    if (!result.length) {
                        return res.status(400).json({
                            succes: false,
                            message: 'Credenciales Incorrectas . Email',
                            errors: error
                        })
                    } else {
                        //Si fue eliminado de manera lógica envío 400
                        if(result[0].activo===0) return res.status(400).json({success:false, message:'Credenciales Incorrectas',errors:error})
                        if (!helpers.match_password(identify.contrasena, result[0].contrasena)) {
                            return res.status(400).json({
                                success: false,
                                message: 'Credenciales Incorrectas - Contraseña',
                                errors: error
                            })
                        } else {
                            return res.status(200).json({
                                success: true,
                                token: helpers.create_token(result[0].email, 120),
                                message: 'Usuario obtenido con éxito',
                                user: result[0],
                                type: 'finanzas'
                            })
                        }
                    }
                }
            }
        }) //fin mc finanzas
    }
}

auth.forgot = (req, res) => {
  let email = req.body.email
  console.log(req.body)
  if (!email){return res.status(400).json({success:false,message:'Debes incluir un email'})}
  if(pool){
    const consulta = pool.query("SELECT 'ciudadano' as type, nombre , email FROM ciudadano WHERE email=? UNION SELECT 'encargado' as type, nombre as encargado , email FROM encargado WHERE email=? UNION " +
      "SELECT 'finanzas' as type, nombre as finanzas, email  FROM finanzas WHERE email=?", [email, email, email], (error, result)=>{
      if (error){
        return res.status(500).json({
          success:false,
          message:'Ha ocurrido un error al verificar usuario',
          error: error
        })
      }else{
        console.log(result)
        if(!result.length){
          return res.status(400).json({
            success:false,
            message:'Usuario no encontrado/registrado en nuestro sistema.'
          })
        }else{
          // return res.status(200).json({
          //   success:true,
          //   message:'El usuario existe',
          //   user:result
          // })
          //EL usuario existe en el sistema, por ende enviamos correo
          var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth:{
              user: process.env.EMAIL_ID,
              pass: process.env.EMAIL_PASS
            }
          })
          let token = helpers.create_token(result[0].email, 5)
          let code = generator({length:8, type:'base64'})
          if(pool){
            let expiry = new Date()
            expiry.setMinutes(expiry.getMinutes()+5)
            pool.query('INSERT INTO reset (token, code, expiry) VALUES (?,?,?)',[token,code, expiry], (error2, result2)=>{
              if(error2){
                return res.status(500).json({
                  success:false,
                  message:'Ha habido un error al generar código, contacta con administrador',
                  error:error2
                })
              }else{
                //Se insertó el token
                var mailOptions = {
                  from: 'ObrasChillán',
                  to: email,
                  subject: 'Recupera tu contraseña',
                  text:'Hola '+result[0].nombre+', hemos recibido una solicitud para restablecer la contraseña asociada a la cuenta '+ result[0].email +
                    '\nPara restablecer, ingresa el siguiente código: '+code+'\nDebes tener en cuenta que el código expirará en 5 minutos, si no alcanzas a usarlo, deberás solicitar otro.'
                }
                transporter.sendMail(mailOptions, (error, info)=>{
                  if(error){
                    console.log('Error Email: '+error)
                    return res.status(500).json({
                      success:false,
                      message:error.message
                    })
                  }else{
                    let data = {
                      email:result[0].email,
                      type:result[0].type
                    }
                    console.log('Email sent')
                    return res.status(200).json({
                      success:true,
                      message:mailOptions,
                      data:data
                    })
                  }
                })
              }
            })
          }

        }
      }

    })
  }
}
auth.sendEmail = (req, res) =>{
  //id ciudadano, Estado, Id del reporte
  let idCiudadano = req.body.id_ciudadano
  console.log(idCiudadano)
  let estado = req.body.estado
  console.log(estado)
  let idReporte = req.body.idReporte
  console.log(idReporte)
  if (pool){
    pool.query('SELECT * FROM ciudadano WHERE id=?', idCiudadano, (error, result)=>{
      if(error){
        return res.status(500).json({
          success:false,
          message:'Error interno',
          error:error
        })
      }else{
        if(result.length){
          let email = result[0].email
          let nombre = result[0].nombre
          var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth:{
              user: process.env.EMAIL_ID,
              pass: process.env.EMAIL_PASS
            }
          })
          var mailOptions = {
            from: 'ObrasChillán',
            to: email,
            subject: 'Cambio de Estado en tu Reporte',
            text:`Hola ${nombre} te informamos que el reporte que ingresaste con el id: ${idReporte}, ha pasado a estar con el estado: ${estado}.`
          }
          transporter.sendMail(mailOptions, (error, info)=>{
            if(error){
              console.log('Error Email: '+error)
              return res.status(500).json({
                success:false,
                message:error.message
              })
            }else{
              console.log('Email sent')
              return res.status(200).json({
                success:true,
                message:mailOptions,
                error:error
              })
            }
          })
        }
      }
    })
  }
}
auth.verify = (req, res) => {
  let code = req.body.code
  let email = req.body.email
  if(!code||!email){return res.status(400).json({success:false,message:'Debes incluir el código/email'})}
  if(pool){
    pool.query('SELECT token FROM reset WHERE code=?', code,(error, result)=>{
      if(error){
        return res.status(500).json({
          success:false,
          message:'Ha habido un error en la verificación, vuelve a intentarlo',
          error:error
        })
      }else{
        if(!result.length){
          return res.status(404).json({
            success:false,
            message:'El código proporcionado no éxiste o ha expirado.',
          })
        }else{
          let token = result[0].token
          let payload = jwt_decoder(token, process.env.MASTER_KEY)
          if (payload.exp <= moment().unix()) {
            return res.status(401).json({
              success: false,
              message: 'Solicitud fuera de tiempo',
              error: 'La autorización/token ha expirado'
            })
          }
          if(email!=payload.sub){
            return res.status(403).json({
              success:false,
              message:'No estas autorizado a usar este código',

            })
          }
          //Eliminar
          return res.status(200).json({
            success:true,
            message:'Código verificado con éxito',
            email:email,
            token:token
          })
        }
      }
    })
  }
}
auth.entrarGoogle = async (req, res) => {
  const googleToken = req.body.idToken;
  try {
    const {  given_name,family_name, email, picture } = await googleVerify( googleToken );
    if (pool){
      pool.query('SELECT * FROM ciudadano WHERE email =?', email, function (error,results,fields){
        if(error){
          return res.status(500).json({
            success:false,
            message:'Error al buscar usuario',
            errors: error
          })
        }
        if(!results.length){
          console.log('Email no existe -> Crear usuario')
          let datosCiudadano = {
            nombre: given_name,
            apellido: family_name,
            run: '',
            email: email,
            contrasena: '',
            imagenPerfil: picture
          }
          pool.query('INSERT INTO ciudadano SET ?', datosCiudadano, (error, resutl1) => {
            if (error) {
              return res.status(400).json({
                success: false,
                message: 'Error al crear ciudadano',
                errors: error
              })
            } else {
              return res.status(201).json({
                success: true,
                message:' Se a creado exitosamente ',
                ciudadano: datosCiudadano,
                id: resutl1.insertId,
                token: helpers.create_token(email, 120)
              })
            }
          })
        }else{
          return res.status(200).json({
            success: true,
            message: 'Usuario google ya registrado',
            token: helpers.create_token(email, 120),
            id: results[0].id
          })
        }
      })
    }
  }catch (error){
    res.status(401).json({
      success: true,
      message:'Token no es correcto'
    });
  }
}
async function googleVerify(token){
  const client = new OAuth2Client(GOOGLE_ID);
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: GOOGLE_ID
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  console.log(payload);
  const { given_name,family_name , email, picture } = payload;
  return {  given_name, family_name, email, picture }
}

auth.comprobarEmail = (req,res) => {
  let email = req.body.email
  console.log(req.body)
  if(pool) {
    pool.query('SELECT * FROM ciudadano WHERE email=?', email, (error, result) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: 'Error al cargar ciudadano',
          errors: error
        })
      } else {
        if (!result.length) {
          return res.status(201).json({
            success: false,
            message: 'No existe email',
            errors: error
          })
        }
      }
      return res.status(200).json({
        success: true,
        message: 'Email encontrado'
      })
    });
  }
}
auth.contacto = (req,res)=>{
  let email = req.body.email
  let nombre = req.body.nombre
  let mensaje = req.body.mensaje
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth:{
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASS
    }
  })
  var mailOptions = {
    from: ''+nombre,
    to: process.env.EMAIL_ID,
    subject: 'Contacto '+nombre,
    text:'Hola! Te contamos que '+nombre+', cuyo correo es '+email+ ' ha utilizado el formulario de contacto para ' +
      'enviar el siguiente mensaje:\n'+mensaje
  }
  transporter.sendMail(mailOptions, (error, info)=>{
    if(error){
      console.log('Error Email: '+error)
      return res.status(500).json({
        success:false,
        message:error.message
      })
    }else{
      console.log('Email sent')
      return res.status(200).json({
        success:true,
        message:mailOptions
      })
    }
  })
}
auth.change = (req,res) => {
  let newPass = helpers.encrypt_password(req.body.pass)
  let email = req.body.email
  let type = req.body.type
  if(pool){
    pool.query('UPDATE ?? SET contrasena=? WHERE email=?', [ type,newPass, email], (error, result)=>{
      if (error){
        return res.status(500).json({
          success:false,
          message:'Ha ahabido un error al cambiar contraseña, intenta mas tarde.',
          error:error
        })
      }else{
        return res.status(200).json({
          success:true,
          message:'Has cambiado tu contraseña con éxito'
        })
      }
    })
  }
}






//exports
module.exports = auth
