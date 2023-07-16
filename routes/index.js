const express=require("express")
const route=express()
const multer=require("multer")
const mongoose=require("mongoose")
const bodyparser=require("body-parser")
const bcrypt=require("bcrypt")
const session=require("express-session")
const middlew=require("../middleware/controll")
const mainf=require("../controllers/main")
const BusData=require("../models/bus")
const SSLCommerzPayment = require("sslcommerz-lts");
const jaladata=require("../data/jala.json")
const signupform=require("../models/signup")
const bookingdata=require("../models/bookingticket")
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
route.get("/ticket",middlew.islogout,(req,res)=>{
  try{
    res.render("./pages/ticket")
  }catch(err){
    console.log(err)
  }
})
route.get("/information",middlew.islogout,async(req,res)=>{
  try{
    var search='';
    if(req.query.search){
      search=req.query.search
    }
    const podata=await BusData.find({from:req.query.from,to:req.query.to,type_bus:req.query.bustype,date:req.query.date});
    console.log(req.query.bustype);
    const userbookdata=await bookingdata.find({from:req.query.from,to:req.query.to}).count();
    const mainseatdata=12-userbookdata;
    if(podata){
      res.render("./pages/information",{data:podata,mainseatdata})
    }else{
      res.render("./pages/information",{message:"We do not have this type of service"})
    }
  }catch(err){
    console.log(err)
  }
})
route.get("/setdata",middlew.islogout,(req,res)=>{
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
      type_bus:req.body.acc,
      date:req.body.date,
      broad:req.body.broad,
      drop:req.body.drop,
    });
    Busin.save();
    res.redirect("/setdata")
  }catch(err){
    console.log(err.name)
  }
})
// route.get("/booked/:id",async(req,res)=>{
//   try{
//     const sessi= req.session.user_id
//     const userinfo=await BusData.findById({_id:req.params.id});
//     console.log(userinfo)
//     res.render("./pages/booke",{data:userinfo,sessioninfo:sessi})
//   }catch(err){
//     console.log(err)
//   }
// })
route.get("/pament",middlew.islogout,(req,res)=>{
  console.log(req.params.id)
  const pp="64b3d2992a774031f3f4ecdf";
const dayt=bookingdata.findById({_id:pp})
  const data = {
    total_amount:50,
    currency: 'BDT',
    tran_id: pp,
    success_url:`http://localhost:2000/pament/success/${pp}`,
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
    cus_phone: '01679610868',
    cus_fax: '01679610868',
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
route.get("/pament/success/:id",async(req,res)=>{
  try{
    const dataf=await bookingdata.findById({_id:req.params.id});
    res.render("./pages/printpage",{data:dataf})
  }catch(err){
   console.log(err)
  }
})
route.post("/pament/success/:id",(req,res)=>{
     try{
       res.redirect(`/pament/success/${req.params.id}`)
     }catch(err){
      console.log(err)
     }
})
//booking information
// rental bookin
route.get("/ticketbook/:id",middlew.islogout,async(req,res)=>{
  try{
    const ticketidp=req.params.id;
    const userfrom=req.query.board;
    const userto=req.query.drop;
    const username=req.query.name;
    const usereamil=req.query.email;
    const usernumber=req.query.number;
    const userseat=req.query.seat;
    const userbroad=req.query.from;
    const userdrop=req.query.to;
    const usedate=req.query.date;
    const useridd=req.query.date;
    const ticketdata=await BusData.findById({_id:ticketidp});
    console.log(ticketdata)
    res.render("./pages/bus",{data:ticketdata,username,usereamil,usernumber,userseat,userto,userfrom,userbroad,userdrop,usedate,useridd});
  }catch(err){
    console.log(err)
  }
})
route.post("/ticketbook",(req,res)=>{
  try{
    const ticketidp=req.params.id;
    const userfrom=req.body.broad;
    const userto=req.body.drop;
    const username=req.body.name;
    const usereamil=req.body.email;
    const usernumber=req.body.number;
    const userseat=req.body.seat;
    const userdate=req.body.date;
    const userfro=req.body.from;
    const usertoo=req.body.to;
    const setticketbook=new bookingdata({
      from:userfro,
      to:usertoo,
      boarding:userfrom,
      dropping:userto,
      time:userdate,
      seat:userseat,
      name:username,
      number:usernumber,
      email:usereamil
    });
     console.log(req.body.name);
     if(setticketbook){
      setticketbook.save();
      console.log("Your Information"+"name:"+req.query.name+"email:"+req.query.email);
      res.redirect("/pament/")
     }else{
      console.log("something wrong")
     }
  }catch(err){
    console.log(err)
  }
})
// route.get("/ticketbook",(req,res)=>{

// })
//completed 
// error page

// admin page
route.get("/admin",middlew.islogout,(req,res)=>{
  try{
      res.render("./pages/login")
  }catch(err){
    console.log(err)
  }
})
route.post("/admin",async(req,res)=>{
  try{
    const email=req.body.email;
    const pass=req.body.password;
    const usergatdata=await signupform.findOne({email:email});
    if(usergatdata){
        if(usergatdata.password==pass){
            req.session.user_id=usergatdata;
            res.redirect("/dashboard")
        }else{
        res.render("./pages/login",{message:"Please,Properly Fill Up Your Information"})
   }
   }else{
        res.render("./pages/login",{message:"Please,Properly Fill Up Your Information"})
   }
  }catch(err){
    console.log(err)
  }
})
// dashboard
route.get("/dashboard",middlew.islogin,async(req,res)=>{
  try{
    const busDat=await BusData.find();
     res.render("./pages/dashboard",{data:busDat})
  }catch(err){
    console.log(err)
  }
})
// booking user
route.get("/bookingusers",middlew.islogin,async(req,res)=>{
  try{
    const busDat=await bookingdata.find();
     res.render("./pages/bookinguser",{data:busDat})
  }catch(err){
    console.log(err)
  }
})
route.get("/dashboard/logout",middlew.islogin,(req,res)=>{
  try{
      req.session.destroy();
      res.redirect("/admin")
  }catch(err){
    console.log(err)
  }
})
// delete bus data
route.get("/deletebus/:id",async(req,res)=>{
  try{
     const h=await BusData.findByIdAndDelete({_id:req.params.id},req.body);
     res.redirect("/dashboard")
  }catch(err){
   console.log(err.name)
  }
});
route.get("/bookinguser/:id",async(req,res)=>{
  try{
     const h=await bookingdata.findByIdAndDelete({_id:req.params.id},req.body);
     res.redirect("/bookingusers")
  }catch(err){
   console.log(err.name)
  }
});
//admin page
route.get("*",(req,res)=>{
  try{
    res.send("This Page Can Not Exist 😂😊🤣😎😉");
  }catch(err){
    console.log(err)
  }
})
// book information
module.exports=route;