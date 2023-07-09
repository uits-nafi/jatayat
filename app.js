const express=require("express")
const app=express();
const router=require("./routes/index")

app.use(router)
app.listen(2000,()=>{
    console.log("ok run port")
});
