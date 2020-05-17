const Grupo = require('../Models/Grupo');
const Usuario=require('../Models/Usuario');
const Auth =require('../middleware/auth');

module.exports={
    async index(request,response){      
        const {page=1}=request.query; 
        const GrupoRetorno=await Grupo.paginate({},{page,limit:5});
        return response.json(GrupoRetorno);
    },
    async getGruposUsuario(request, response){
        const idUser=request.user._id;
        
        console.log(idUser);
        const gruposUsuario = await Grupo.find({participantes:{$elemMatch:{_id:idUser}}});
        
        
        var retorno=[{
            admin:true,
            _idGrupo:"123",
            nomeGrupo:'Nome do Grupo',
            dataSorteio:'01-01-2000',
            dataEvento:'01-01-2000',
            valorMaximo:10,
            valorMinimo:20,
            status:"Em aberto",
            criadoEm:'01-02-2000',
            participantes:[{nome:"Fulano",email:"@"},{nome:"siclano",email:"@"}],
            amigo:"Nome"
        },
        {
            admin:false,
            _idGrupo:"123",
            nomeGrupo:'Nome do Grupo',
            dataSorteio:'01-01-2000',
            dataEvento:'01-01-2000',
            valorMaximo:10,
            valorMinimo:20,
            status:"Em aberto",
            criadoEm:'01-02-2000',
            participantes:[{nome:"Fulano",email:"@"},{nome:"siclano",email:"@"}],
            amigo:"Nome"
        }
    
    ]
        return response.json(retorno);
    },

    async getGrupo(request,response){
        let{_id}=request.body;
        const GrupoRetorno=await Grupo.find({_id:_id});
        return response.json(GrupoRetorno);
    },
    
    async create(request,response){
        let{nome,dataSorteio,dataEvento,valorMinimo,valorMaximo}=request.body;
        const _id=request.user._id;
        var hoje = new Date();
        hoje.setUTCHours(0);
        hoje.setUTCMinutes(0);
        hoje.setUTCSeconds(0);
        hoje.setUTCMilliseconds(0);
        dataSorteio=Date.parse(dataSorteio);
        dataEvento=Date.parse(dataEvento);

        try {
            if(dataSorteio>=hoje & dataEvento>=dataSorteio & valorMinimo<valorMaximo){
                const GrupoRetorno=await Grupo.create({
                    nome,
                    dataSorteio,
                    dataEvento,
                    valorMinimo,
                    valorMaximo,
                    status:'Em Aberto',
                    criadoPor:{
                        _id:_id
                    },
                    criadoEm: hoje,
                    participantes:[{
                        _id:_id
                    }]
                });
                return response.json(GrupoRetorno);
            }else{
                var datas = dataSorteio>=hoje && dataEvento>=dataSorteio;
                var valores = valorMinimo<valorMaximo;
                return response.json({status: false,datas, valores, msg: "Erro ao cadastrar!"})
            }
        }catch (error) {
            return response.json({status:false,msg: "Falha de comunicação com o servidor!"});
        
        }
        
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
        let{_id,participantes,idLista} = request.body;       
        const GrupoRetorno = await Grupo.update({_id:_id},{$push:{participantes:participantes,idListaDesejos:idLista}});
        return response.json(GrupoRetorno);
    },
    async addLista(request,response){
        let{_id} = request.params; 
        let{idParticipante,idLista}=request.body; 

        //gambiarra
        Grupo.findOneAndUpdate({ _id: _id }, { "$pull": { participantes: { _id: idParticipante } } }, { new: true }, async (err, res) => {
            if (err) {
                return response.send(500).json({ ...generic, _message: err.message });
            }
        });

        Grupo.findOneAndUpdate({ _id: _id }, { "$push": { participantes: { _id: idParticipante,idListaDesejos:idLista } } }, { new: true }, async (err, res) => {
            if (err) {
                return response.send(500).json({ ...generic, _message: err.message });
            }
        });

        return response.json("Lista add com sucesso!");
    },

    async deleteLista(request,response){
        let{_id, idParticipante}=request.body;
        Grupo.findOneAndUpdate({ _id: _id }, { "$pull": { participantes: { _id: idParticipante } } }, { new: true }, async (err, res) => {
            if (err) {
                return response.send(500).json({ ...generic, _message: err.message });
            }
        });
        const GrupoRetorno = await Grupo.update({_id:_id},{$push:{participantes:{_id:idParticipante}}});

        return response.json(GrupoRetorno);
    },
    async deleteParticipante(request,response){
        let{_id}=request.params;
        let{idParticipante}=request.body;
        Grupo.findOneAndUpdate({ _id: _id }, { "$pull": { participantes: { _id: idParticipante } } }, { new: true }, async (err, res) => {
            if (err) {
                return response.send(500).json({ ...generic, _message: err.message });
            }
        });
        return response.json('Participante removido com sucesso!');
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
        //const status="Sorteado";
        await Grupo.update({_id:_id},{$set:{status:"Sorteado"}});

        return response.json(embaralhado);
    },
    async deleteSorteio(request,response){
        let{_id}=request.params;
        const sorteio=[];
        const status = "Em aberto";
        const GrupoRetorno=await Grupo.update({_id:_id},{$set:{sorteio:sorteio, status:status}}); 
        //const status="Em aberto";
        //GrupoRetorno.update({_id:_id},{$set:{status:status}});
        return response.json(GrupoRetorno);
    }
}

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  }

