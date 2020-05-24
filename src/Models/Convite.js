const mongoose = require('mongoose');
const mongoosePaginate= require('mongoose-paginate');

const ConviteSchema = new mongoose.Schema({
    email:String,
    idGrupo:String
});
ConviteSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Convite',ConviteSchema); 