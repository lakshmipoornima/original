//jshint esversion:6
require('dotenv').config();
const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app=express();


mongoose.connect("mongodb://localhost:27017/userDB",{ useNewUrlParser: true, useUnifiedTopology: true });



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

const userSchema=new mongoose.Schema({
  email:String,
  password:String
});

const secret=process.env.SECRET;

userSchema.plugin(encrypt,{secret:secret,encryptedFields: ['password']});

const User=mongoose.model("User",userSchema);



app.get("/",function(req,res)
{
  res.render("home");
});
app.get("/login",function(req,res)
{
  res.render("login");
});
app.get("/register",function(req,res)
{
  res.render("register");
});


app.post("/register",function(req,res)
{
  const newUser=new User(
    {
      email:req.body.username,
      password:req.body.password
    }
  );
  newUser.save(function(err){
    if(err)
    console.log(err);
    else
    res.render("secrets");
  });

});

app.post("/login",function(req,res){
  User.findOne({email:req.body.username},function(err,foundResult)
   {

     if(err){
      //console.log("foundResult: "+foundResult);
      console.log("You are not a registered user. Please register to find the secret.");

    }

    else
    {
      if(foundResult===null)
      console.log("You are not a registered user. Please register to find the secret.");
      else if(foundResult.email===req.body.username&&foundResult.password===req.body.password)
      res.render("secrets");
      else
      {


        if (foundResult.password!==req.body.password)
        console.log("Incorrect password");
        else
        console.log("Incorrect email and password");
      }
    }
  });
});



app.listen(process.env.PORT||3000,function(){
  console.log("Server started on port 3000...");
});
