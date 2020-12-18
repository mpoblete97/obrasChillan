//require
const moment = require('moment')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
//
const helpers = {}
//Para guardar contraseña en el registro
helpers.encrypt_password = (password)=>{
    const hash = bcrypt.hashSync(password,10)
    return hash
}
//Para validar en el login
helpers.match_password = (password , saved_password)=>{
    var match = false
    try{
        match = bcrypt.compareSync(password, saved_password)
    }catch(e){
        console.log(e)
    }
    return match
}

helpers.create_token = (email, minutes)=>{
    const payload = {
        sub: email,
        iat:moment().unix(),
        // exp:moment().add(minutes,"minutes").unix()
        exp:moment().add(minutes,"minutes").unix()
    }
    return jwt.sign(payload,process.env.MASTER_KEY)
}
module.exports = helpers
