const mongoose=require("mongoose")

const UserSignup=mongoose.Schema({
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    is_admin:{
        type:Number,
        require:true
    }
},{timestamps:true})
module.exports=new mongoose.model("UserData",UserSignup)