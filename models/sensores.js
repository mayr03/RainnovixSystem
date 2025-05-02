const mongoose = require('mongoose');

const sensorMongo=new mongoose.Schema({
    id:{type:string, required:true},
    FechaHora:{type:DateTime, required:true},
    Estado:{type:string,required:true},
    NivelAgua:{type:Int,required:true},
},{
    timestamps:true,
});
module.exports=mongoose.model('sensores', sensorMongo);
const Sensor=mongoose.model('Sensor',sensorMongo);
export default Sensor;