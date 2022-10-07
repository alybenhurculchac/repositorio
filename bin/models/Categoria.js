const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategoriaSchema = new Schema({
    name: String,
    descripcion : String,
    color : String,
    urlImagen : String,
    recursos : [],
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

var Categoria = mongoose.model("Categoria", CategoriaSchema);

module.exports = Categoria;