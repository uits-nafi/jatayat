const mongoose=require("mongoose")

const Businfo=mongoose.Schema({
    from:{
        type:String,
        require:true
    },
    to:{
        type:String,
        require:true
    },
    bus:{
        type:String,
        require:true
    },
    price:{
        type:String,
        require:true
    },
    start:{
        type:String,
        require:true
    },
    type_bus:{
        type:String,
        require:true
    },
    date:{
        type:String,
        require:true
    },
    broad:{
        type:String,
        require:true
    },
    drop:{
        type:String,
        require:true
    }
},{timestamps:true})
module.exports=new mongoose.model("Businforamtion",Businfo)