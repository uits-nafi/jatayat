const isadmin=(req,res,next)=>{
    try{
        if(req.session.user_id){}
        else{
            res.redirect("/admin")
        }
        next()
    }catch(err){
       console.log(err.name)
    }
};
const isadlogout=(req,res,next)=>{
    try{
        if(req.session.user_id){
            res.redirect("/dashboard")
        }
        next()
    }catch(err){
        console.log(err.name)
    }
};
module.exports={isadmin,isadlogout}
