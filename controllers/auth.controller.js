import {User} from '../models/User.js'
import jwt from 'jsonwebtoken';
export const register = async(req,res)=>{
    console.log(req.body);
    const {email , password} = req.body
    try{
        // alternativa de validacion, buscando por email
        let user = await User.findOne({email});
        if (user) throw {code: 11000};

        user = new User({email,password});
        await user.save();

        // jwt token

        return res.status(201).json({ok: 'true'});   
    }catch(e){
        console.log(e);
        // Validacion por defecto mongoose
        if(e.code === 11000){
            return res.status(400).json({ error: "Ya existe este usuario"});
        }
        return res.status(500).json({error: "Error de servidor"})
    }
}

export const login = async (req,res)=>{
    try{
        const {email , password} = req.body
        let user = await User.findOne({email});
        if(!user) return res.status(403).json({error: "No existe el usuario"});
        const respuestaPassword = await user.comparePassword(password);
        if(!respuestaPassword){
            return res.status(403).json({error: "La contrasenia o el mail son incorrectos"});
        }
        // Generar token jwt
        const token = jwt.sign({uid: user.id},process.env.JWT_SECRET)

        return res.json({token});
    }catch(e){
        console.log(e);
        return res.status(500).json({error: "Error de servidor"})
    }
    
}
