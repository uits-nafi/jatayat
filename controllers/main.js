const about=(req,res)=>{
    try{
        res.render("./pages/about")
    }catch(err){
        console.log(err)
    }
}
module.exports={about}