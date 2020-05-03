const Usuario = require('../Models/Usuario');
const jwt = require('jsonwebtoken')

module.exports={
    async geraToken(request,response){

        let{email,senha}=request.body;
        const UsuarioRetorno = await Usuario.findOne({email:email,senha:senha});

        if(!UsuarioRetorno){
            return response.json({auth:false,msg:"Usuario ou senha incorreta!!"});
        }
        else{
            const token = jwt.sign({email:UsuarioRetorno.email, senha:UsuarioRetorno.senha},process.env.JWT_KEY,{expiresIn:3000});
            return response.json({auth:true,token:token,nome:UsuarioRetorno.nome});
        }
    }
}