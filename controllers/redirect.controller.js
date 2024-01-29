import { Link } from "../models/Link.js";

export const redirectLink = async (req,res)=>{
    
        try{
            const {nanoLink} = req.params;
            console.log(nanoLink);
            const link = await Link.findOne({nanoLink});
            console.log(link);
            if(!link) return res.status(404).json({error: 'No existe el link gil'})
            return res.redirect(link.longLink)
        }catch(e){
            console.log(e);
            if(e.kind === 'ObjectId'){
                return res.status(403).json({error: 'Formato ID incorrecto'})
            }
            return res.status(500).json({error: 'Error de servidor'})
        }
   
}