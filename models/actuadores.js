const mongoose = require('mongoose');

const actuadorMongo=new mongoose.Schema({
    id:{type:string, required:true},
    FechaHora:{type:DateTime, required:true},
    Estado:{type:string,required:true},
},{
    timestamps:true,
});
module.exports=mongoose.model('Actuadores', actuadorMongo);
const Actuador=mongoose.model('Actuador',actuadorMongo);
export default Actuador;