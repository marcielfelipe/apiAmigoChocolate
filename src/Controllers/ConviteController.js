const Convite = require('../Models/Convite');

module.exports={
    async index(request,response){      
        const {page=1}=request.query; 
        const ConviteRetorno=await Convite.paginate({},{page,limit:5});
        return response.json(ConviteRetorno);
    },

}