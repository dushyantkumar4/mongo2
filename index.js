const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const Chat=require("./models/chat.js");
const methodOverride=require("method-override");
const ExpressError=require("./ExpressError");

app.set("views",path.join(__dirname,"views"));
app.set("view eingine","ejs");

app.use(express.static("public"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));

main().then(()=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/fakewhatsapp");
}

//index route
app.get("/chats",asyncWrap( async (req,res,next)=>{
        let chats= await Chat.find();
        res.render("index.ejs",{chats}); 
}));

//new roeute
app.get("/chats/new",(req,res)=>{
    // throw new ExpressError(404,"page not found");
    res.render("new.ejs");
});

//create route
app.post("/chats",asyncWrap( async (req,res,next)=>{
        let{from,to,msg}=req.body;
        let newChat=new Chat({
            from:from,
            to:to,
            msg:msg,
            created_at:new Date()
        });
        await newChat.save()
        res.redirect("/chats");
}));

function asyncWrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    }
}

//new created show route
app.get("/chats/:id",asyncWrap(async(req,res,next)=>{
    
        let {id}=req.params;
        let chat=await Chat.findById(id);
        if(!chat){
            return next(new ExpressError(404,"chat not fount"));
        }
        res.render("edit.ejs",{chat});
}));

//edit route
app.get("/chats/:id/edit",asyncWrap( async (req,res,next)=>{
 
        let {id}=req.params;
        let chat= await Chat.findById(id); 
        res.render("edit.ejs",{chat}); 
}));
//update route
app.put("/chats/:id",asyncWrap(async(req,res,next)=>{
        let{id}=req.params;
        let {msg:newMsg}=req.body;
        let updatedChat= await Chat.findByIdAndUpdate(id,
            {msg:newMsg},
            {runValidators: true, new: true}
        );
        console.log(updatedChat);
        res.redirect("/chats");
}));
//delete route
app.delete("/chats/:id",asyncWrap( async (req,res,next)=>{
        let {id}=req.params;
        let delChat= await Chat.findByIdAndDelete(id);
        res.redirect("/chats");   
}));

app.get("/",(req,res)=>{
    console.log("app is working");
    res.send("app is working");
});

const handleValidationErr=(err)=>{
    console.log("this is validation error please follow the rule");
    console.dir(err.message);
    return err; 
}

app.use((err,req,res,next)=>{
    console.log(err.name);
    if(err.name==="ValidationError"){
        err=handleValidationErr(err);
    }
    next(err);
});
//error handling middleware
app.use((err,req,res,next)=>{
    let {status=500,message="some error Occurred"}=err;
    res.status(status).send(message);
});

app.listen(8080,()=>{
    console.log(`app is working on port 8080`);
});