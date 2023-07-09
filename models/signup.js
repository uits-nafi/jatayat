const mongoose=require("mongoose")

const UserSignup=mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    }
},{timestamps:true})
module.exports=new mongoose.model("UserData",UserSignup)