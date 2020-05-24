const mongoose=require('mongoose');
const mongoosePaginate= require('mongoose-paginate');

const GrupoSchema=new mongoose.Schema({
    nome:String,
    dataSorteio:Date,
    dataEvento:Date,
    valorMinimo:Number,
    valorMaximo:Number,
    status:String,
    criadoPor:String,
    criadoEm:Date,
    participantes:[{
        _id:String,
        nome:String,
        email:String,
        dataNascimento:Date,
        status:Boolean,
        listaDesejos:[String],
        amigo:String
    }]
});
GrupoSchema.plugin(mongoosePaginate);

module.exports=mongoose.model('Grupo',GrupoSchema);
