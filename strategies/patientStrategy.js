const LocalStrategy = require("passport-local");
const Patient = require("../models/Patient")
const bcrypt = require("bcrypt");

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


module.exports = patientStrategy
