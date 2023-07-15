const mongoose=require("mongoose")

const ticketbook=mongoose.Schema({
    from:{
        type:String,
        require:true
    },
    to:{
        type:String,
        require:true
    },
    time:{
        type:String,
        require:true
    },
    seat:{
        type:String,
        require:true
    },
    name:{
        type:String,
        require:true
    },
    number:{
        type:Number,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    paid_status:{
        type:String,
        default:0
    }
},{timestamps:true})
module.exports=new mongoose.model("busticket",ticketbook)