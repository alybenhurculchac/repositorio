const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Categoria_Schema = new Schema({
    name: String,
    descripcion : String,
    color : String,
    urlImagen : String,
    creador : {type : String, required : true, unique : false},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
    subcategorias : [{
      type : Schema.Types.ObjectId, 
      ref  : 'Subcategoria'
    }]
});

var Categoria = mongoose.model("Categoria", Categoria_Schema);

module.exports = Categoria;