const isadmin=(req,res,next)=>{
    try{
        if(req.session.user_id){}
        else{
            res.redirect("/login")
        }
        next()
    }catch(err){
       console.log(err.name)
    }
};
const isadlogout=(req,res,next)=>{
    try{
        if(req.session.user_id){
            res.redirect("/admin-page")
        }
        next()
    }catch(err){
        console.log(err.name)
    }
};
module.exports={isadmin,isadlogout}
