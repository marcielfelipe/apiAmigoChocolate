const mongoose = require('mongoose');
const mongoosePaginate= require('mongoose-paginate');

const ListaDesejosSchema = new mongoose.Schema({
    itens:[
        {
            item:String
        }
    ]
});

ListaDesejosSchema.plugin(mongoosePaginate);

module.exports=mongoose.model('ListaDesejos',ListaDesejosSchema);