const Grupo = require('../Models/Grupo');
const Usuario=require('../Models/Usuario');
const Convite=require('../Models/Convite');
const Auth =require('../middleware/auth');
const axios = require('axios');

module.exports={
    async index(request,response){      
        const {page=1}=request.query; 
        const GrupoRetorno=await Grupo.paginate({},{page,limit:5});
        return response.json(GrupoRetorno);
    },
    async getGrupo(request,response){
        let{_id}=request.body;
        const GrupoRetorno=await Grupo.find({_id:_id});
        return response.json(GrupoRetorno);
    },
    async create(request,response){
        let{nome,dataSorteio,dataEvento,valorMinimo,valorMaximo}=request.body;
        const _id=request.user._id;
        const nomeUser=request.user.nome;
        const email=request.user.email;
        const dataNascimento=request.user.dataNascimento;
        const statusUser=request.user.status;


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
                    criadoPor:nomeUser,
                    criadoEm: hoje,
                    participantes:[{
                        _id,
                        nome:nomeUser,
                        email,
                        dataNascimento,
                        status:statusUser,
                        amigo:''
                    }]
                    
                });
                return response.json({status:true,msg:"Grupo cadastrado com sucesso!"});
            }else{
                var datas = dataSorteio>=hoje && dataEvento>=dataSorteio;
                var valores = valorMinimo<valorMaximo;
                return response.json({status: false,datas, valores, msg: "Erro ao cadastrar grupo!"})
            }
        }catch (error) {
            return response.json({status:false,msg: "Falha de comunicação com o servidor!"});
        
        }
        
    },
    async edit(request,response){
        let{_id,nome,dataSorteio,dataEvento,valorMinimo,valorMaximo}=request.body;
        //atualizar no banco mongodb
        try {
            const GrupoRetorno=await Grupo.updateOne({_id:_id},{$set:{nome,dataSorteio,dataEvento,valorMinimo,valorMaximo}});
            return response.json({status:true,msg:"Grupo alterado com sucesso!"});
            
        } catch (error) {
            return response.json({status:false,msg:"Falha de comunicação com o servidor!"});
        }
    },
    async delete(request,response){
        let{_id}=request.params;
        //delete no banco mongodb
        try {
            const GrupoRetorno=await Grupo.deleteOne({_id:_id}); 
            return response.json({status:true,msg:"Grupo deletado com sucesso!"});
            
        } catch (error) {
            return response.json({status:false,msg:"Erro ao deletar grupo"});
        }
    },
    async getGruposUsuario(request, response){
        const email=request.user.email;
        const GrupoRetorno = await Grupo.find({participantes:{$elemMatch:{email}}});
        var retorno=[];
        for (let index = 0; index < GrupoRetorno.length; index++) {
            retorno[index] = {
                _id:GrupoRetorno[index]._id,
                nome:GrupoRetorno[index].nome,
                dataSorteio:GrupoRetorno[index].dataSorteio,
                dataEvento:GrupoRetorno[index].dataEvento,
                valorMinimo:GrupoRetorno[index].valorMinimo,
                valorMaximo:GrupoRetorno[index].valorMaximo,
                status:GrupoRetorno[index].status,
                criadoPor:GrupoRetorno[index].criadoPor,
                criadoEm:GrupoRetorno[index].criadoEm,
                participantes:GrupoRetorno[index].participantes
            }; 
        }
        return response.json(retorno);


    },
    async getParticipantes(request,response){
        let {_id}=request.body;
        try {
            const GrupoRetorno = await Grupo.findOne({_id});
            var participantes=GrupoRetorno.participantes;
            return response.json(participantes);
            
        } catch (error) {
            return response.json("Erro de conexão com o servidor!");
        }
    },
    async addParticipante(request,response){
        let{_id,email} = request.body;    
        try {
            const UsuarioRetorno=await Usuario.findOne({email:email});
            if (!UsuarioRetorno){
                const grupo = await Grupo.findOne({_id});
                const convidaUser = await Convite.update({email},
                    {
                       $set: { email,idGrupo:_id },
                       $setOnInsert: { defaultQty: 100 }
                    },
                    { upsert: true });
                console.log(convidaUser);

                await axios.post('https://emailautomatico.herokuapp.com/send',
                    {   
                        to:email, 
                        subject: 'Convite Amigo Chocolate',
                        html:`<h1>Amigo Chocolate</h1><p>${request.user.nome} (${request.user.email}) te convidou para participar do ${grupo.nome}. Para aceitar, <a href='appamigochocolate.netlify.app'>clique aqui </a> para fazer seu cadastro</p>`
                    }
                )
                return response.json({status:false,msg:"Convite enviado com sucesso!"});
            }
            const ValidaParticipante = await Grupo.find({_id:_id,participantes:{$elemMatch:{email:email}}});
            if(ValidaParticipante.length==0){
                const GrupoRetorno = await Grupo.update({_id:_id},{$push:{
                    participantes:{
                    _id:UsuarioRetorno._id,
                    nome:UsuarioRetorno.nome,
                    email:email,
                    dataNascimento:UsuarioRetorno.dataNascimento,
                    status:UsuarioRetorno.status,
                    amigo:""
                }}});
              
                return response.json({status:true,msg:"Usuário adicionado com sucesso!"});

            }
            else{
                return response.json({status:false,msg:"Usuário já está adicionado ao grupo!"});
            }
            
        } catch (error) {
            return response.json({status:false,msg:"Erro de comunicação com servidor!"});
        }
        
    },
    async deleteParticipante(request,response){
        console.log(request.body);
        const {_id,email}=request.body;
        
         try {
            
            //const ValidaParticipante = await Grupo.findOneAndDelete({_id:_id,participantes:{$elemMatch:{email:email}}});
            const GrupoRetorno = await Grupo.updateOne({ _id}, { $pull : { participantes: { email } } });
            
            //const retornGrupo = await Grupo.updateOne({ _id }, { $pull : { participantes : { _idParticipante }}});
            return response.json({status:true,msg:'Participante removido com sucesso!'});  

        } catch (error) {
            return response.json({status:false,msg:"Erro de comunicação com servidor!"});
        } 
        
    },
    async addLista(request,response){
        let{_id,desejo}=request.body; 
        const email = request.user.email;
        const GrupoRetorno = await Grupo.findOne({_id,participantes:{$elemMatch:{email}}});
        var participantes=GrupoRetorno.participantes;
        for (let index = 0; index < participantes.length; index++) {
            if(email==participantes[index].email){
                participantes[index].listaDesejos.push(desejo);    
            }
        }
        const addItem=await Grupo.update({_id},{$set:{participantes}});
        return response.json({status:true,msg:'Item adicionado com sucesso!'});
    },
    async deleteLista(request,response){
        let{_id,desejo}=request.body; 
        const email = request.user.email;
        const GrupoRetorno = await Grupo.findOne({_id,participantes:{$elemMatch:{email}}});
        var participantes=GrupoRetorno.participantes;
        for (let index = 0; index < participantes.length; index++) {
            if(email==participantes[index].email){
                participantes[index].listaDesejos.pull(desejo);    
            }
        }
        const addItem=await Grupo.update({_id},{$set:{participantes}});
        return response.json({status:true,msg:'Item deletado com sucesso!'});
    },
    async sorteio(request,response){
        let{_id}=request.params;
        const status = "Sorteado";
        try {
            const GrupoRetorno=await Grupo.findOne({_id});
            const participantes=GrupoRetorno.participantes;
            //const lista=participantes.map(item=>{return item.id}); 
            var embaralhado = shuffle(participantes);
            //var embaralhado = embaralhar(lista);
            for (let i = 0; i < embaralhado.length; i++) {
                if(i<(embaralhado.length-1)){
                    //console.log(embaralhado[i].amigo);
                    embaralhado[i].amigo = embaralhado[i+1].nome;
                }else{
                    embaralhado[i].amigo = embaralhado[0].nome;
                }
            }
            const addItem=await Grupo.update({_id},{$set:{participantes:embaralhado,status}});
            return response.json({status:true,msg:'Sorteio realizado com sucesso!'});
        } catch (error) {
            return response.json("erro");
        }
    },
    async deleteSorteio(request,response){
        let{_id}=request.params;
        const status = "Em Aberto";
        try {
            const GrupoRetorno=await Grupo.findOne({_id});
            const participantes=GrupoRetorno.participantes;
            for (let i = 0; i < participantes.length; i++) {
                participantes[i].amigo = '';
            }
            const addItem=await Grupo.update({_id},{$set:{participantes,status}});
            return response.json({status:true,msg:'Sorteio deletado com sucesso!'});
        } catch (error) {
            return response.json("erro");
        }
    }
}

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function embaralhar(lista){
    for(let i = lista.length; i ; i--){
        const indiceAleatorio = Math.floor(Math.random() * i);
        const elemento = lista[i-1];
        lista[i-1] = lista[indiceAleatorio];
        lista[indiceAleatorio] = elemento
    }
    return lista;
}

