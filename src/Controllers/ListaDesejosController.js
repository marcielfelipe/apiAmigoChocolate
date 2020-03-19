const ListaDesejos=require('../Models/ListaDesejos');

module.exports={
    async index(request,response){
        const {page=1}=request.query;
        const ListaDesejosRetorno=await ListaDesejos.paginate({},{page,limit:2});
        return response.json(ListaDesejosRetorno);
    },
    async getListaDesejos(request,response){
        let{_id}=request.params;
        //inserir aluno no banco mongodb
        const ListaDesejosRetorno=await ListaDesejos.find({_id:_id});
        return response.json(ListaDesejosRetorno);
    },
    async create(request,response){
        let{idGrupo,idParticipante,itens}=request.body;
        const ListaDesejosRetorno=await ListaDesejos.create({
            idGrupo,
            idParticipante,
            itens
        });
        return response.json(ListaDesejosRetorno);
    },   
    async edit(request,response){
        let{_id,idGrupo,idParticipante,itens}=request.body;
        //atualizar no banco mongodb
        const ListaDesejosRetorno=await ListaDesejos.updateOne({_id:_id},{$set:{idGrupo:idGrupo,idParticipante:idParticipante,itens:itens}});
        return response.json(ListaDesejosRetorno);
    }, 
    async delete(request,response){
        let{_id}=request.params;
        //delete no banco mongodb
        const ListaDesejosRetorno=await ListaDesejos.deleteOne({_id:_id});
        return response.json(ListaDesejosRetorno);
    },
    async addItem(request,response){
        let{_id,itens} = request.body;       
        const ListaDesejosRetorno = await ListaDesejos.update({_id:_id},{$push:{itens:itens}});
        return response.json(ListaDesejosRetorno);
    },

}