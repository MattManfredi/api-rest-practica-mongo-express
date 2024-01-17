import {User} from '../models/User.js'
import jwt from 'jsonwebtoken';
import { generateRefreshToken, generateToken } from '../utils/tokenManager.js';
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
        const {token,expiresIn} = generateToken(user.id)
        generateRefreshToken(user.id, res);
        // res.cookie("token", token,{
        //     httpOnly: true,
        //     secure: !(process.env.MODO === "developer")
        // });


        return res.json({token,expiresIn});
    }catch(e){
        console.log(e);
        return res.status(500).json({error: "Error de servidor"})
    }
    
}

export const infoUser = async(req,res)=>{
    try{
        const user = await User.findById(req.uid).lean()
       return res.json({email: user.email, uid: user.uid})    
    }catch(e){
        return res.status(500).json({error: "error de server"})
    }   
    
}

export const refreshToken = (req,res)=>{
    try{
        const refreshTokenCookie = req.cookies.refreshToken;
        if(!refreshTokenCookie) throw new Error("No existe el token");

        const {uid} = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);

        const {token,expiresIn} = generateToken(uid);
        return res.json({token ,expiresIn});
    }catch(e){
        console.log(e);
        const TokenVerificationErrors = {
                        "invalid signature": "La firma del JWT no es valida",
                        "jwt expired": "JWT expirado",
                        "invalid token": "Token no valido",
                        "No Bearer": "Utiliza formato Bearer",
                        "jwt malformed" : "JWT formato no valido",
                    };
        return res.status(401).send({error: TokenVerificationErrors[e.message]})
    }
}

export const logout = (req,res)=>{
    res.clearCookie('refreshToken');
    res.json({ok:true})
}