const{Router}= require('express');

const UsuarioController=require('./src/Controllers/UsuarioController');
const GrupoController=require('./src/Controllers/GrupoController');
const LoginController=require('./src/Controllers/LoginController');
const ConviteController=require('./src/Controllers/ConviteController');
const ListaDesejosController=require('./src/Controllers/ListaDesejosController');
const auth = require('./src/middleware/auth');


//validação
const {validate} = require('./src/middleware/validator');
const {UsuarioValidationRules} = require('./src/validations/UsuarioValidation');
const {GrupoValidationRules} = require('./src/validations/GrupoValidation');

const route=Router();
//convites
route.get('/convite',ConviteController.index);

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
route.get('/grupo/:_id',auth,GrupoController.getGrupo);
route.post('/grupo',auth,GrupoValidationRules(),validate, GrupoController.create);
route.put('/grupo',auth,GrupoController.edit);
route.delete('/grupo/:_id',auth,GrupoController.delete);
//participante
route.put('/grupo/participante',auth,GrupoController.addParticipante);
route.post('/grupo/participante',auth,GrupoController.deleteParticipante);
route.put('/grupo/listadesejos',auth,GrupoController.addLista);
route.get('/participantes/:_id',auth,GrupoController.getParticipantes);
//sorteio
route.get('/grupo/sorteio/:_id',auth,GrupoController.sorteio);   //sortear
route.put('/grupo/sorteio',auth,GrupoController.deleteSorteio); //delete sorteio

//lista nos grupos
route.put('/grupo/addlista',auth,GrupoController.addLista);   //adiciona lista de desejos ao participante
route.get('/lista/:_id',auth,ListaDesejosController.getLista);  
route.put('/grupo/deletelista',auth,GrupoController.deleteLista);   //deleta lista de desejos do participante


module.exports=route;