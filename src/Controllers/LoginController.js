const Usuario = require('../Models/Usuario');
const jwt = require('jsonwebtoken')

module.exports={
    async geraToken(request,response){

        let{email,senha}=request.body;
        const UsuarioRetorno = await Usuario.findOne({email:email,senha:senha});
        if(!UsuarioRetorno){
            return response.send("Usuario ou senha incorreta").json({ ...generic, _message: err.message });
        }
        else{
            const token = jwt.sign({email:UsuarioRetorno.email, senha:UsuarioRetorno.senha},process.env.JWT_KEY,{expiresIn:3000});
            return response.send({auth:true,token:token});
        }
    }
}