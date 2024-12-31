const mongoose=require("mongoose");
const Chat=require("./models/chat.js");


main().then(()=>{
    console.log("connection successful");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}

  let allChats=[
    {
        from:"alok",
        to:"akash",
        msg:"send me money",
        created_at:new Date()
    },
    {
        from:"ashwani",
        to:"prashant",
        msg:"send me the file",
        created_at:new Date()
    },
    {
        from:"ram",
        to:"shyam",
        msg:"teach me js callbacks",
        created_at:new Date()
    },
    {
        from:"rohit",
        to:"mohit",
        msg:"teach me function in js",
        created_at:new Date()
    },
    {
        from:"priti",
        to:"shruti",
        msg:"send me yesterdays notes",
        created_at:new Date()
    },
    {
        from:"aman",
        to:"chaman",
        msg:"stay at home",
        created_at:new Date()
    },
    {
        from:"pranjal",
        to:"pushpendra",
        msg:"help me",
        created_at:new Date()
    }
];
Chat.insertMany(allChats);