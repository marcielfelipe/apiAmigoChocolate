const Usuario = require('../Models/Usuario');

module.exports={
    async index(request,response){
        const {page=1}=request.query;
        const UsuarioRetorno=await Usuario.paginate({},{page,limit:5});
        return response.json(UsuarioRetorno);
    },
    async getUsuario(request,response){
        const _id=request.user._id;
        const UsuarioRetorno = await Usuario.find({_id:_id});
        const user=UsuarioRetorno[0];
        return response.json({nome:user.nome,email:user.email,dataNascimento:user.dataNascimento});
    },
    async create(request,response){
        let { nome,email,senha,dataNascimento }=request.body;
        const validaEmail = await Usuario.find({email:email});
        if(validaEmail.length==0){
            const UsuarioRetorno = await Usuario.create({
                nome,
                email,
                senha,
                dataNascimento,
                status:true
            });
            return response.json({register:true,msg:'Usuário cadastrado com sucesso!'});
            
        }
        else if(!validaEmail[0].status){
            const ativarRetorno = await Usuario.updateOne({email:email},{$set:{status:true}});
            response.json({register:false,msg:'Seja bem vindo novamente, faça login!'});
        }else{
            response.json({register:false,msg:'Email cadastrado, faça login!'});
        }
    },

    async edit(request,response){
        let {nome,email,dataNascimento}=request.body;

        try{
            const UsuarioRetorno=await Usuario.updateOne({email:email},{$set:{nome:nome,dataNascimento:dataNascimento}});
            console.log(UsuarioRetorno);
            if(UsuarioRetorno.n==0){
                return response.json({edit:false,msg:"Usuário não encontrado"});
            }else{
                return response.json({edit:true,msg:'Dados atualizados com sucesso!'});
            }
        }catch{
            return response.json({edit:false,msg:'Erro de comunicação com o servidor!'});
        }
    },

    async editSenha(request,response){
        let {senhaAntiga,novaSenha}=request.body;

        const _id=request.user._id;
        const UsuarioRetorno=await Usuario.updateOne({_id:_id,senha:senhaAntiga},{$set:{senha:novaSenha}});
        console.log(UsuarioRetorno);
        console.log(UsuarioRetorno.nModified);

        if(UsuarioRetorno.n==0){
            return response.json({staus:false,msg:'Senha incorreta!'});
        }else if(UsuarioRetorno.n==1 & UsuarioRetorno.nModified==0){
            return response.json({staus:false,msg:'Nova senha igual a senha anterior!'});
        }
        else{
            return response.json({staus:true,msg:'Senha alterada com sucesso!'});
        }
    },

    async delete(request,response){
        const _id=request.user._id;
        const UsuarioRetorno=await Usuario.updateOne({_id:_id},{$set:{status:false}});
        return response.json({staus:false,msg:'Usuário desativado com secesso!'});
    },
}
