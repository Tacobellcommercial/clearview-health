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

const patientSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  authority: String
})

const Patient = mongoose.model("Patient", patientSchema)

const doctorSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  password: String,
  authority: String
})

const Doctor = mongoose.model("Doctor", doctorSchema);



app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static("public"));

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}))

app.use(passport.authenticate("session"));

const patientStrategy = new LocalStrategy((username, password, callback)=>{
  Patient.find({username: username}, (err, arrayOfDocuments)=>{
    if (err){return callback(err)}
    if (arrayOfDocuments.length === 0){return callback(null, false, {message: "Patient not found..."})}

    const userObject = arrayOfDocuments[0]
    bcrypt.compare(password, userObject.password, (err, result)=>{
      if (result == true){
        return callback(null, userObject)
      }else{
        return callback(null, false, {message: "Incorrect password..."})
      }
    })

  })
});

// const doctorStrategy = new LocalStrategy((username, password, callback)=>{
//
// });

passport.use("patientStrategy", patientStrategy);
// passport.use(doctorStrategy);

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

app.post("/patient-sign-up", (req, res)=>{
  Patient.find({"username": req.body.username}, (err, arrayOfDocuments)=>{
    if (arrayOfDocuments.length == 0){
      bcrypt.hash(req.body.password, 10, (err, encryptedPassword)=>{
        const newPatient = new Patient({
          firstName: req.body.fName,
          lastName: req.body.lName,
          username: req.body.username,
          password: encryptedPassword,
          authority: "Patient"
        })

        newPatient.save((err, result)=>{
          res.render("Register", {
            title: "Register | Clearview Health",
            errorMessage: "",
            successMessage: "Successfully signed up!"
          })
        })
      })
    }else{
      res.render("Register", {
        title: "Register | Clearview Health",
        errorMessage: "Username already taken...",
        successMessage: ""
      })
    }
  })
})

app.post("/patient-login", (req, res, next) => {
  passport.authenticate("patientStrategy", (err, user, info)=>{
    if (!user){
      res.render("Login", {
        title: "Login | Clearview Health",
        errorMessage: "Wrong username/password...",
        successMessage: ""
      })
    }else{
      req.logIn(user, (err)=>{
        console.log(user);
        res.redirect("/home");
      })
    }
  })(req, res, next);
});

app.listen(3000, ()=>{
  console.log("Listening on port 3000");
})
