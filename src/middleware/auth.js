const jwt=require('jsonwebtoken')
const Usuario = require('../Models/Usuario')

const auth = async(req,res,next)=>{
    const token = req.header("Authorization").replace('Bearer ', '');
    const data = jwt.verify(token,process.env.JWT_KEY)
    try{
        const user = await Usuario.findOne({email:data.email, senha:data.senha});
        if(!user){
            throw new Error()
        }
        req.user=user
        req.token=token
        next()       
    } catch(error){
        res.status(401).send({error:'Not authorized to access this resource'})
    }

}

module.exports=auth