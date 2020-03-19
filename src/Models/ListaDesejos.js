const mongoose = require('mongoose');
const mongoosePaginate= require('mongoose-paginate');

const ListaDesejosSchema = new mongoose.Schema({
    idGrupo:{type: mongoose.Schema.Types.ObjectId, ref: 'Grupo'},
    idParticipante:{type: mongoose.Schema.Types.ObjectId, ref: 'Usuario'},
    itens:[String]
});

ListaDesejosSchema.plugin(mongoosePaginate);

module.exports=mongoose.model('ListaDesejos',ListaDesejosSchema);