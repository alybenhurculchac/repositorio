const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid')
const Categoria = require("../bin/models/Categoria");
const Subcategoria = require("../bin/models/Subcategoria");
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

    async getCategorias(res){
        await Categoria.find({})
        .populate("subcategorias") 
        .then(categorias => {
            res.send(categorias);
         });
         
    }

    setRecursos(recurso,res)
    {
        try{
        const { _idc, _ids, ...realRecurso } = recurso;
        console.log(recurso)
         Subcategoria.findOneAndUpdate(
            { _id: recurso._ids},
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

    async setSubcategoria(subcategoria,res){
        try{
                       
             const cate =   await Categoria.findById(subcategoria.cat);
             if (cate){
                Subcategoria.create(subcategoria, function(err, newsubcategoria){
                    if(err) throw err;

                    Categoria.findOneAndUpdate(
                        { _id: subcategoria.cat }, 
                        { $push: { subcategorias: newsubcategoria._id } },
                        function (err, success) {
                            if(err) throw err;
                        })

                    res.send({status: 200, nU: "Subcategoria  creada con exito ..."});
                });

             }
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

    getSubcategoriaId(id,res){
        Categoria.find({_id: id})
        .populate("subcategorias") 
        .then(categorias => {
              res.send(categorias);
         });
    }



    getSubcategoria(id,res){
        Subcategoria.find({_id: id})
        .then(subcategoria => {
              res.send(subcategoria);
         });
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
                  expiresIn: "2h",
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
 


deleteSubcategoria(data, res){
    var {id} = data;
    Subcategoria.findOneAndDelete(
        {"_id" : id},
        function (error, doc) {
            if (error) {
                res.send({status: 400, nU: "Se produjo um error... "});
            } else {
                res.send({status: 200, nU: "Subcategoria borrada con exito ..."});
            }
        }

    )
}

async deleteCategoria(data,res){
    var {_id} = data;
    var categorias = await Categoria.findOne({ _id });
    
    for(data of categorias.subcategorias){
       await Categoria.updateOne({_id : _id}, {
             $pullAll: {
                subcategorias: [{_id: data._id}],
            },
        });
     await Subcategoria.findOneAndDelete({"_id" : data._id}) 
    }

    await Categoria.findOneAndDelete({"_id" : _id}) 

    res.send({status: 200, nU: "Borrada categoria exitosamente ..."});
}

async deleteRecurso(data,res){
    var {ids, idr} = data;
    console.log(ids,idr)
    Subcategoria.findOne({_id: ids},
       function (error, docs) {
          
          var {recursos} =  docs.recursos;
           if (error) {
              console.log(error)
            }

          for(data in docs.recursos){ 
             if (docs.recursos[data]._id == idr)
              {
               docs.recursos.splice(data,1);
              
              }
          }

          console.log(docs)

          Subcategoria.findByIdAndUpdate({_id : ids}, docs,
          function (error, docs) {
            if (error) {
                res.send({status: 200, nU: "Se produjo un error al momento de borrar el recurso ..."});
            }
            res.send({status: 200, nU: "Recursos borrado con exito ..."});

           
        });
    }
    )}

}




exports.Controller = new Controller;