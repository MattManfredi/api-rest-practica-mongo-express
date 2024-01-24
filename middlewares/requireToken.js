import jwt from "jsonwebtoken";
import { TokenVerificationErrors } from "../utils/tokenManager.js";
export const requireToken = (req,res,next)=>{
    
    try{
        let token = req.headers?.authorization;

        if(!token) throw new Error('No existe el token en el header, usa Bearer');

        token = token.split(" ")[1];
        const {uid} = jwt.verify(token, process.env.JWT_SECRET);

        req.uid = uid;

        next();
    }catch(e){
        console.log(e);
        return res.status(401).send({error: TokenVerificationErrors[e.message]});
    }
}