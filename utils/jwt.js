import jwt from 'jsonwebtoken';


export const generateToken = async (userId,role,res)=>{
    try {
        const token = jwt.sign({userId,role},process.env.JWT_SECRET,{expiresIn:'1h'});


        res.cookie("jwt",token,{
        maxAge:60*60*1000,
        httpOnly:true,
        samesite:"strict",
        secure:process.env.NODE_ENV!=="development"
    })
    } catch (error){
        console.log("Error while generating token",error);
        res.status(500).json({error:"Internal server error"});
    }
}