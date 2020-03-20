const{Router}= require('express');

const UsuarioController=require('./src/Controllers/UsuarioController');
const GrupoController=require('./src/Controllers/GrupoController');
const ListaDesejosController=require('./src/Controllers/ListaDesejosController');
const LoginController=require('./src/Controllers/LoginController');
const auth = require('./src/middleware/auth');


//validação
const {validate} = require('./src/middleware/validator');
const {UsuarioValidationRules} = require('./src/validations/UsuarioValidation');
const {GrupoValidationRules} = require('./src/validations/GrupoValidation');

const route=Router();
//login
route.get('/login/:_id/:senha',LoginController.geraToken);

//usuario
route.get('/usuario',UsuarioController.index);
route.get('/usuario/:_id',auth,UsuarioController.getUsuario);
route.post('/usuario',UsuarioValidationRules(), validate, UsuarioController.create);
route.put('/usuario',UsuarioController.edit);
route.delete('/usuario/:_id',UsuarioController.delete);

//grupo
route.get('/grupo',GrupoController.index);
route.get('/grupo/:_id',GrupoController.getGrupo);
route.post('/grupo',GrupoValidationRules(),validate, GrupoController.create);
route.put('/grupo',GrupoController.edit);
route.delete('/grupo/:_id',GrupoController.delete);
//participante
route.put('/grupo/participante',GrupoController.addParticipante);
route.post('/grupo/participante/:_id',GrupoController.deleteParticipante);
route.put('/grupo/listadesejos',GrupoController.addLista);
//sorteio
route.get('/grupo/sorteio/:_id',GrupoController.sorteio);   //sortear
route.put('/grupo/sorteio/:_id',GrupoController.deleteSorteio); //delete sorteio

//lista de desejos
route.get('/listadesejos',ListaDesejosController.index);    //listar todas listas de desejos
route.get('/listadesejos/:_id',ListaDesejosController.getListaDesejos); //get em uma lista de desejos
route.post('/listadesejos',ListaDesejosController.create);  //criar lista de desejos
route.put('/listadesejos',ListaDesejosController.edit)  //editar lista de desejos
route.delete('/listadesejos/:_id',ListaDesejosController.delete);    //deletar lista de desejos
route.put('/listadesejos/deleteitem/:_id',ListaDesejosController.deleteItem);  //deleta item da lista de desejos
route.put('/listadesejos/additem',ListaDesejosController.addItem);  //adicionar item a lista de desejos


module.exports=route;