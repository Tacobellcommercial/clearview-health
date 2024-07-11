require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const session = require("express-session");

const app = express();

mongoose.connect("mongodb+srv://tacobellcommercial:"+process.env.PASSWORD+"@cluster0.0zda3uf.mongodb.net/")

const Patient = require("./models/Patient")
const Doctor = require("./models/Doctor")

const patientStrategy = require("./strategies/patientStrategy");
const doctorStrategy = require("./strategies/doctorStrategy");

const patientSignupRouter = require("./routes/patientSignup");
const patientLoginRouter = require("./routes/patientLogin");

app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static("public"));

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}))

app.use(passport.authenticate("session"));


passport.use("patientStrategy", patientStrategy);
passport.use("doctorStrategy", doctorStrategy);

passport.serializeUser((user, callback)=>{
  process.nextTick(()=>{
    callback(null, {id: user._id, username: user.username})
  })
})

passport.deserializeUser((user, callback)=>{
  process.nextTick(()=>{
    return callback(null, user);
  })
})

app.use("/patient-sign-up", patientSignupRouter); /*POST*/

app.use("/patient-login", patientLoginRouter); /*POST*/

app.get("/", (req, res)=>{
  res.render("LandingPage", {
    title: "Landing Page | Clearview Health"
  });
})

app.get("/home", (req, res)=>{
  if (req.isAuthenticated()){
    /*IF PATIENT THEN*/
    res.render("PatientHome");
  }
})

app.get("/login", (req, res)=>{
  res.render("Login", {
    title: "Login | Clearview Health",
    errorMessage: "",
  });
})

app.get("/register", (req, res)=>{
  res.render("Register", {
    title: "Register | Clearview Health",
    errorMessage: "",
    successMessage: ""
  })
})


app.listen(3000, ()=>{
  console.log("Listening on port 3000");
})
