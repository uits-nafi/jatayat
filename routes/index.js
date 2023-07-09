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
const SSLCommerzPayment = require("sslcommerz-lts");
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
route.get("/logout",middlew.islogin,(req,res)=>{
  try{
       req.session.destroy();
       res.redirect("/")
  }catch(err){
    console.log(err)
  }
})
route.get("/dashboard",middlew.islogin,(req,res)=>{
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
route.get("/",middlew.islogout,(req,res)=>{
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
route.get("/ticket",middlew.islogin,(req,res)=>{
  try{
    res.render("./pages/ticket")
  }catch(err){
    console.log(err)
  }
})
route.get("/information",middlew.islogin,async(req,res)=>{
  try{
    var search='';
    if(req.query.search){
      search=req.query.search
    }
    const podata=await BusData.find({from:req.query.from});
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
route.get("/booked/:id",middlew.islogin,async(req,res)=>{
  try{
    const sessi= req.session.user_id
    const userinfo=await BusData.findById({_id:req.params.id});
    console.log(userinfo)
    res.render("./pages/booke",{data:userinfo,sessioninfo:sessi})
  }catch(err){
    console.log(err)
  }
})
route.get("/pament/:id",middlew.islogin,async(req,res)=>{
  const dataset=await BusData.findById({_id:req.params.id});
  const data = {
    total_amount:dataset.price,
    currency: 'BDT',
    tran_id: 'REF123',
    success_url: `${process.env.ROOT}/ssl-payment-success`,
    fail_url: `${process.env.ROOT}/ssl-payment-fail`,
    cancel_url: `${process.env.ROOT}/ssl-payment-cancel`,
    shipping_method: 'No',
    product_name: 'Computer.',
    product_category: 'Electronic',
    product_profile: 'general',
    cus_name: 'Customer Name',
    cus_email: 'cust@yahoo.com',
    cus_add1: 'Dhaka',
    cus_add2: 'Dhaka',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: '01711111111',
    cus_fax: '01711111111',
    multi_card_name: 'mastercard',
    value_a: 'ref001_A',
    value_b: 'ref002_B',
    value_c: 'ref003_C',
    value_d: 'ref004_D',
    ipn_url: `${process.env.ROOT}/ssl-payment-notification`,
  };

  const sslcommerz = new SSLCommerzPayment('testbox', 'qwerty', false) //true for live default false for sandbox
  sslcommerz.init(data).then(data => {

    //process the response that got from sslcommerz 
    //https://developer.sslcommerz.com/doc/v4/#returned-parameters

    if (data?.GatewayPageURL) {
      return res.status(200).redirect(data?.GatewayPageURL);
    }
    else {
      return res.status(400).json({
        message: "Session was not successful"
      });
    }
  });
})
route.get("/rental",middlew.islogin,async(req,res)=>{
  try{
    var search='';
    if(req.query.search){
      search=req.query.search
    }
    const podata=await BusData.find({from:req.query.from});
     res.render("./pages/rental",{data:podata,typeo:req.query.type})
  }catch(err){
    console.log(err)
  }
})
// rental bookin
route.get("/rentalpage/:id",middlew.islogin,async(req,res)=>{
  try{
    const sessi= req.session.user_id
    const userinfo=await BusData.findById({_id:req.params.id});
    console.log(userinfo)
    res.render("./pages/rentalpage",{data:userinfo,sessioninfo:sessi})
  }catch(err){
    console.log(err)
  }
})
module.exports=route;