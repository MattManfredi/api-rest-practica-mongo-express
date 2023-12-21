import mongoose from "mongoose";

try{
    await mongoose.connect(process.env.URI_MONGO)
    console.log('Connect to DB ok 🫡');
} catch(e){
    console.log('Error de conexion a mongoDB: '+ e);
}
