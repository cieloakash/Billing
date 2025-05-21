import jwt from "jsonwebtoken"

export const genToken =(userId,role,res)=>{
    const token = jwt.sign({id:userId,role:role},process.env.JWT_SECRET,{
        expiresIn:"24h"
    });

    res.cookie("jwtoken",token,{
        maxAge:24*60*60*1000,
        httpOnly:true,
        sameSite: "strict",
    })
    return token
}

