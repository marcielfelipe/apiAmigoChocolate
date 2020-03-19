const Usuario = require('../Models/Usuario');

module.exports={
    async index(request,response){
        const {page=1}=request.query;
        const UsuarioRetorno=await Usuario.paginate({},{page,limit:2});
        return response.json(UsuarioRetorno);
    },
    async getUsuario(request,response){
        let{_id}=request.params;
        const UsuarioRetorno = await Usuario.find({_id:_id});
        return response.json(UsuarioRetorno);
    },
    async create(request,response){
        let { nome,email,senha,dataNascimento }=request.body;
        const UsuarioRetorno = await Usuario.create({
            nome,
            email,
            senha,
            dataNascimento
        });
        return response.json(UsuarioRetorno);
    },
    async edit(request,response){
        let {nome,email,senha,dataNascimento}=request.body;
        const UsuarioRetorno=await Usuario.updateOne({email:email},{$set:{nome:nome,senha:senha,dataNascimento:dataNascimento}});
        return response.json(UsuarioRetorno);
    },
    async delete(request,response){
        let{_id}=request.params;
        const UsuarioRetorno=await Usuario.deleteOne({_id:_id});
        return response.json(UsuarioRetorno);
    },
}
