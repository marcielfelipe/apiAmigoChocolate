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
route.post('/login',LoginController.geraToken);

//usuario
route.get('/usuario',auth, UsuarioController.index);
route.get('/meuperfil',auth,UsuarioController.getUsuario);
route.post('/usuario',UsuarioValidationRules(), validate, UsuarioController.create);
route.put('/usuario',UsuarioValidationRules(), auth,UsuarioController.edit);
route.delete('/usuario',auth,UsuarioController.delete);
route.put('/editsenha',auth,UsuarioController.editSenha);
//grupo
route.get('/todosgrupos',auth,GrupoController.index);
route.get('/gruposusuario',auth,GrupoController.getGruposUsuario);
route.get('/grupo',auth,GrupoController.getGrupo);
route.post('/grupo',auth,GrupoValidationRules(),validate, GrupoController.create);
route.put('/grupo',auth,GrupoController.edit);
route.delete('/grupo/:_id',auth,GrupoController.delete);
//participante
route.put('/grupo/participante',auth,GrupoController.addParticipante);
route.post('/grupo/participante/:_id',auth,GrupoController.deleteParticipante);
route.put('/grupo/listadesejos',auth,GrupoController.addLista);
//sorteio
route.get('/grupo/sorteio/:_id',auth,GrupoController.sorteio);   //sortear
route.post('/grupo/sorteio/:_id',auth,GrupoController.deleteSorteio); //delete sorteio
//lista de desejos
route.get('/listadesejos',auth,ListaDesejosController.index);    //listar todas listas de desejos
route.get('/listadesejos/:_id',auth,ListaDesejosController.getListaDesejos); //get em uma lista de desejos
route.post('/listadesejos',auth,ListaDesejosController.create);  //criar lista de desejos
route.put('/listadesejos',auth,ListaDesejosController.edit)  //editar lista de desejos
route.delete('/listadesejos/:_id',auth,ListaDesejosController.delete);    //deletar lista de desejos
//itens da lista
route.put('/listadesejos/deleteitem',auth,ListaDesejosController.deleteItem);  //deleta item da lista de desejos
route.put('/listadesejos/additem',auth,ListaDesejosController.addItem);  //adicionar item a lista de desejos
//lista nos grupos
route.post('/grupo/addlista/:_id',auth,GrupoController.addLista);   //adiciona lista de desejos ao participante
route.post('/grupo/deletelista',auth,GrupoController.deleteLista);   //deleta lista de desejos do participante


module.exports=route;