import jwt from "jsonwebtoken";
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

        const TokenVerificationErrors = {
            "invalid signature": "La firma del JWT no es valida",
            "jwt expired": "JWT expirado",
            "invalid token": "Token no valido",
            "No Bearer": "Utiliza formato Bearer",
            "jwt malformed" : "JWT formato no valido",
        };

        return res.status(401).send({error: TokenVerificationErrors[e.message]});
    }
}
// export const requireToken = (req,res,next)=>{
//     try{
//         let token = req.headers?.authorization;
//         if(!token) {throw new Error('No existe el token en el header, usa Bearer');}
//         token=token.split(" ")[1];
//         const {uid} = jwt.verify(token, process.env.JWT_SECRET)
//         req.uid = uid;
//         next();
//     }catch(e){
//         console.log(e);

//         const TokenVerificationErrors = {
//             "invalid signature": "La firma del JWT no es valida",
//             "jwt expired": "JWT expirado",
//             "invalid token": "Token no valido",
//             "No Bearer": "Utiliza formato Bearer",
//             "jwt malformed" : "JWT formato no valido",
//         };

//         return res.status(401).send({error: TokenVerificationErrors[e.message]});
//     }
// }