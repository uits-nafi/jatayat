const islogin=async(req,res,next)=>{
    try{
    if(req.session.user_id){}
    else{
      res.redirect("/")
    }
    next()
    }catch(err){
      console.log(err)
    }
}
const islogout=async(req,res,next)=>{
  try{
  if(req.session.user_id){
      res.redirect("/dashboard")
  }
  next()
  }catch(err){
    console.log(err)
  }
}
module.exports={islogin,islogout}