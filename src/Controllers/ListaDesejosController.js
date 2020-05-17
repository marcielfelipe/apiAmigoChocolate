const ListaDesejos=require('../Models/ListaDesejos');

module.exports={
    async index(request,response){
        const {page=1}=request.query;
        const ListaDesejosRetorno=await ListaDesejos.paginate({},{page,limit:2});
        return response.json(ListaDesejosRetorno);
    },
    async getListaDesejos(request,response){
        let{_id}=request.params;

        const ListaDesejosRetorno=await ListaDesejos.findOne({_id:_id});
        return response.json(ListaDesejosRetorno);
    },
    async create(request,response){
        let{itens}=request.body;
        const ListaDesejosRetorno=await ListaDesejos.create({
            itens
        });
        return response.json(ListaDesejosRetorno);
    },   
    async edit(request,response){
        let{_id,itens}=request.body;
        //atualizar no banco mongodb
        const ListaDesejosRetorno=await ListaDesejos.updateOne({_id:_id},{$set:{itens:itens}});
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
    async deleteItem(request, response){
        let{_id, desejo}=request.body;
        ListaDesejos.findOneAndUpdate({ _id: _id }, { "$pull": { itens: { item: desejo } } }, { new: true }, async (err, res) => {
            if (err) {
                return response.send(500).json({ ...generic, _message: err.message });
            }
        });
        return response.json('Item removido com sucesso!');
    },
    
}