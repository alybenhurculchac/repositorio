const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Subcategoria_Schema = new Schema({
  
    nombre : {type : String, required : true, unique : false},
    descripcion : {type : String, required : true, unique : false},
    color : {type : String, required : true, unique : false},
    creador : {type : String, required : true, unique : false},
    cat : {
        type : Schema.Types.ObjectId, 
        ref  : 'Categoria'
    },
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
        recursos : 
          [{
            nombre : {type : String, required : true, unique : false},
            descripcion : {type : String, required : true, unique : false},
            urlrecurso : {type : String, required : true, unique : false},
            urlimagen : {type : String, required : true, unique : false},
            color : {type : String, required : true, unique : false},
            creador : {type : String, required : true, unique : false},

          }],
        })    

        var Subcategoria = mongoose.model("Subcategoria", Subcategoria_Schema);

        module.exports = Subcategoria;