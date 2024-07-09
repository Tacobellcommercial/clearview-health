require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();


app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static("public"));


app.get("/", (req, res)=>{
  res.render("LandingPage", {
    title: "Landing Page | Clearview Health"
  });
})

app.get("/home", (req, res)=>{

})

app.listen(3000, ()=>{
  console.log("Listening on port 3000");
})
