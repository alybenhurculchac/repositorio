const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UsuariosSchema = new Schema({
    usuario: String,
    clave: String,
    rol :{
        id : String,
        nombre : String,
    },
    token :String,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
   
});

var Usuarios = mongoose.model("Usuarios", UsuariosSchema);

module.exports = Usuarios;