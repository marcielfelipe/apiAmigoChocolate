const Grupo = require('../Models/Grupo');
const Usuario=require('../Models/Usuario');
const Convite=require('../Models/Convite');
const Auth =require('../middleware/auth');
const axios = require('axios');

module.exports={
    async getLista(request,response){
        let _id=request.params;
        const email=request.user.email;
        const GrupoRetorno = await Grupo.findOne({_id,participantes:{$elemMatch:{email}}});
        var participantes=GrupoRetorno.participantes;
        var oneParticipante='';
        for (let index = 0; index < participantes.length; index++) {
            if(participantes[index].email==email){
                oneParticipante=participantes[index];
            }
        }
        response.json(oneParticipante.listaDesejos);

    }
};