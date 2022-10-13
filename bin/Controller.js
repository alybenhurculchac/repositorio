const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid')
const Categoria = require("../bin/models/Categoria");
const Usuarios = require("../bin/models/Usuarios");
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");
const config = require("./config/config")

class Controller{

    constructor(){
        this.connect();
    }

    async connect(){
        try{
			const  mongoAtlasUri =
            'mongodb+srv://aly:alyben1234@cluster0.kazshnz.mongodb.net/?retryWrites=true&w=majority';
               await mongoose.connect(
                mongoAtlasUri,
                { useNewUrlParser: true, useUnifiedTopology: true },
            );
            console.log('conectado');
        }catch(e){
            console.error(e);
        }
    }

    setCategoria(categoria, res) {
           Categoria.create(categoria, function(err, newCategoria){
            if(err) throw err;
            res.send({status: 200, nU: "Categirua creada con exito ..."});
        });
    }

    getCategorias(res){
        Categoria.find({}, function(err, categorias){
            if(err) throw err;
            res.send(categorias);
        })
    }

    setRecursos(recurso,res)
    {
        try{
        const { _id, ...realRecurso } = recurso;
        Categoria.findOneAndUpdate(
            { _id: recurso._id }, 
            { $push: { recursos: realRecurso  } },
           function (err, success) {
            if(err) throw err;
            res.send({nU : "Recurso creado con exito ..."});
             });
         }
         catch (err) {
            console.log(err);
         }

    }
    
    getCategoriaId(id,res){
        Categoria.find({_id: id}, function(err, categoria){
            if(err) throw err;
            res.send(categoria)
        })
    }

    async setUser(usu, res) {
        const { usuario, clave} = usu;
        var enc =  await bcrypt.hash(clave,10);

        Usuarios.findOne({ usuario: usuario }, (erro, usuarioDB)=>{
            if (erro) {
                res.send({status: 200, nU: "Se ha producido un error ..."});
             }
           
           else if (!usuarioDB) {
               usu.clave = enc;
               Usuarios.create(usu, function(err, newCategoria){
               if(err) throw err;
                 res.send({status: 200, nU: "Usuario creado con exito ..."});
               });  
            
           }
           else{
            res.send({status: 200, nU: "El usuario ya existe ..."});
           }


        })

          
}

async setLogin(dat, res) {
    try {
        const { usuario, clave } = dat;
    
        var user = await Usuarios.findOne({ usuario });
       
        if (user && (await bcrypt.compare(clave, user.clave))) {
          
            const token = jwt.sign(
                { user_id: user._id },
                config.llave,
                {
                  expiresIn: "60s",
                }
              );

             user.token = token;
              
            res.send({status: 200, nU: user});
        }
        else
        {
            res.send({status: 400, nU: "Usuario o Clave Invalido"});
        }
        

    }
    catch (err) {
        console.log(err);
      }
    
}
async getRecursoNombre(data,res){
    console.log(data)
    const { id, nombre } = data;
    const resp = Categoria.aggregate([
        {$match: {'recursos.nombre': {$eq: 'html'}}},
        // unwind the grades array
        {$unwind: '$recursos'},
        // match the relevant unwound array element
        {$match: {'recursos.nombre': {$eq: 'html'}}},
        // re-group the array elements
        {$group: {
            _id: '$_id',
            top_reviews: {$push: '$recursos'}
        }}
        ])
    
        res.send({status: 400, nU: resp});
        }
     
    
    


async setChangepassword(data, res){
    var {id, password} = data;
    var encclave =  await bcrypt.hash(password,10);
    Usuarios.updateOne(
        {_id: id},
        {$set: {clave: encclave}}
    )
    .then(rawResponse => {
        res.send({nU: "Cambio de clave exitoso", raw: rawResponse})
    })
    .catch(err => {
        if(err) throw err;
    });
}
 
}

exports.Controller = new Controller;
