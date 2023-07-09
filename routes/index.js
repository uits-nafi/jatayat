const express=require("express")
const route=express()
const multer=require("multer")
const mongoose=require("mongoose")
const bodyparser=require("body-parser")
const bcrypt=require("bcrypt")
const session=require("express-session")
const usedata=require("../models/signup")
const middlew=require("../middleware/controll")
const mainf=require("../controllers/main")
const BusData=require("../models/bus")
mongoose.connect("mongodb+srv://aakbor557:CTJOVarUEQoDH6SR@cluster0.0byudzt.mongodb.net/?retryWrites=true&w=majority",{
    useUnifiedTopology: true,
    useNewUrlParser: true
  }).then(()=>{
    console.log("okk")
}).catch((err)=>{
    console.log(err)
});
route.use(session({ resave: true ,secret: '123456' , saveUninitialized: true}))
route.use(bodyparser.json())
route.use(bodyparser.urlencoded({extended:true}))
route.use(express.static("public"))
route.set("view engine","ejs")

// route.get("/signup",(req,res)=>{
//   try{
//     res.render("./pages/signup")
//   }catch(err){
//     console.log(err)
//   }
// })
const passwo=async (pass)=>{
  const passhash=await bcrypt.hash(pass,10);
  return passhash
}
route.post("/",async(req,res)=>{
  try{
    const sendpass=await passwo(req.body.password);
       
    const Usersave= new usedata({
        name:req.body.name,
        email:req.body.email,
        password:sendpass,
    });
    Usersave.save();
    res.redirect("/login")
  }catch(err){
    console.log(err)
  }
})

route.get("/login",middlew.islogout,(req,res)=>{
  try{
    res.render("./pages/login")
  }catch(err){
    console.log(err)
  }
})
route.get("/dashboard",(req,res)=>{
  try{
      res.render("./pages/dashboard")
  }catch(err){
    console.log(err)
    console.log(err.name)
  }
})
route.post("/login",async(req,res)=>{
  try{
      const email=req.body.email;
      const name=req.body.name;
      const usergatdata=await usedata.findOne({email:email});
      if(usergatdata){
          if(usergatdata.name==name){
              req.session.user_id=usergatdata;
              res.redirect("/dashboard");
              console.log("ok")
          }else{
          res.render("login",{message:"Please,Properly Fill Up Your Information"})
     }
     }else{
          res.render("login",{message:"Please,Properly Fill Up Your Information"})
     }
  }catch(err){
      console.log(err.name)
  }
})
route.get("/about",middlew.islogout,mainf.about)
route.get("/",(req,res)=>{
  try{
    res.render("./pages/home")
  }catch(err){
    console.log(err)
  }
})

route.get("/contact",middlew.islogout,(req,res)=>{
  try{
    res.render("./pages/contact")
  }catch(err){
    console.log(err)
  }
})
route.get("/blog",middlew.islogout,(req,res)=>{
  try{
    res.render("./pages/blog")
  }catch(err){
    console.log(err)
  }
})
route.get("/whyus",middlew.islogout,(req,res)=>{
  try{
    res.render("./pages/whyus")
  }catch(err){
    console.log(err)
  }
})
route.get("/ticket",(req,res)=>{
  try{
    res.render("./pages/ticket")
  }catch(err){
    console.log(err)
  }
})
route.get("/information",async(req,res)=>{
  try{
    var search='';
    if(req.query.search){
      search=req.query.search
    }
    const podata=await BusData.find({from:req.query.from,to:req.query.to});
    console.log(podata)
    res.render("./pages/information",{busdata:podata})
  }catch(err){
    console.log(err)
  }
})
// route.post("/",async(req,res)=>{
//   try{
//     res.redirect("/information")
//   }catch(err){
//     console.log(err)
//   }
// })
route.get("/setdata",(req,res)=>{
  try{
    res.render("./pages/setform")
  }catch(err){
    console.log(err.name)
  }
})
route.post("/setdata",(req,res)=>{
  try{
    const Busin=new BusData({
      from:req.body.from,
      to:req.body.to,
      bus:req.body.bus,
      price:req.body.price,
      start:req.body.start,
    });
    Busin.save();
    res.redirect("/setdata")
  }catch(err){
    console.log(err.name)
  }
})
module.exports=route;