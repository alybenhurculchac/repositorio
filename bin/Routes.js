const express = require("express");
const app = express();
const {Controller} = require("./Controller");
const bodyParser = require("body-parser");
const cors = require("cors");
const auth = require("./middleware/auth");


const config = require("./config/config")

app.set('llave', config.llave);

app.use(cors());

app.use(bodyParser.json());

app.post("/categorias", auth, function(req, res){
    var data = req.body;
    console.log(data)
    Controller.setCategoria(data, res);
});

app.get("/categorias", function(req, res){
   Controller.getCategorias(res);
});


app.post("/categorias_recursos", auth, function(req, res){
   var recurso = req.body;
   Controller.setRecursos(recurso, res);
});

 
 app.get("/categoria/:id", function(req, res){
    const {id} = req.params;
    Controller.getCategoriaId(id, res);
});


 app.post("/user", auth, function(req, res){
   var data = req.body;
   Controller.setUser(data, res);
});

app.post("/login", function(req, res){
   var data = req.body;
   Controller.setLogin(data, res);
});

app.post("/changepassword", auth, function(req, res){
   var data = req.body;
   Controller.setChangepassword(data, res);
});

app.post("/BuscaRecursoNombre", function(req, res){
   var data = req.body;
   console.log(data)
   Controller.getRecursoNombre(data, res);
});

exports.app = app;