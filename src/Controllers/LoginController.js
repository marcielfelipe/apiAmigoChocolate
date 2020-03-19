const Usuario = require('../Models/Usuario');
const jwt = require('jsonwebtoken')

module.exports={
    async geraToken(request,response){

        let{_id,senha}=request.params;
        const UsuarioRetorno = await Usuario.findOne({_id:_id});
        const token = jwt.sign({_id:UsuarioRetorno._id},process.env.JWT_KEY,{expiresIn:300});
        return response.send({auth:true,token:token});
    }
}