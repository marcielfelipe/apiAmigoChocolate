const Grupo = require('../Models/Grupo');

module.exports={
    async index(request,response){      
        const {page=1}=request.query; 
        const GrupoRetorno=await Grupo.paginate({},{page,limit:2});
        return response.json(GrupoRetorno);
    },
    async getGrupo(request,response){
        let{_id}=request.params;
        const GrupoRetorno=await Grupo.find({_id:_id});
        return response.json(GrupoRetorno);
    },
    async create(request,response){
        let{nome,dataSorteio,valorMinimo,valorMaximo}=request.body;
        //inserir no banco mongodb
        const GrupoRetorno=await Grupo.create({
            nome,
            dataSorteio,
            valorMinimo,
            valorMaximo       
        });
        
        return response.json(GrupoRetorno);
    },
    async edit(request,response){
        let{_id,nome,dataSorteio,valorMinimo,valorMaximo}=request.body;
        //atualizar no banco mongodb
        const GrupoRetorno=await Grupo.updateOne({_id:_id},{$set:{nome:nome,dataSorteio:dataSorteio,valorMinimo:valorMinimo,valorMaximo:valorMaximo}});
        return response.json(GrupoRetorno);
    },
    async delete(request,response){
        let{_id}=request.params;
        //delete no banco mongodb
        const GrupoRetorno=await Grupo.deleteOne({_id:_id}); 
        return response.json(GrupoRetorno);
    },
    async addParticipante(request,response){
        let{_id,participantes} = request.body;       
        const GrupoRetorno = await Grupo.update({_id:_id},{$push:{participantes:participantes}});
        return response.json(GrupoRetorno);
    },
    async deleteParticipante(request,response){
    },
    async sorteio(request,response){
        let{_id}=request.params;
        const ParticipantesRetorno=await Grupo.find({_id:_id},{participantes:1,_id:0});
        const lista=ParticipantesRetorno.map(item=>{return item.participantes}); 
        var embaralhado = shuffle(lista[0]);
        for(i=0;i<embaralhado.length;i++){
            if(i<(embaralhado.length-1)){
                await Grupo.update({_id:_id},{$push:{sorteio:{_id:embaralhado[i], _idAmigo:embaralhado[i+1]}}});
            }
            else{
                await Grupo.update({_id:_id},{$push:{sorteio:{_id:embaralhado[i], _idAmigo:embaralhado[0]}}});
            }
        } 
        return response.json(embaralhado);
    },
    async deleteSorteio(request,response){
        let{_id}=request.params;
        let{sorteio}=request.body;
        const GrupoRetorno=await Grupo.update({_id:_id},{$set:{sorteio:sorteio}}); 
        return response.json(GrupoRetorno);
    }
}

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  }

