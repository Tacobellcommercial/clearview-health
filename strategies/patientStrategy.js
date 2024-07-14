const LocalStrategy = require("passport-local");
const Patient = require("../models/Patient")
const bcrypt = require("bcrypt");

const patientStrategy = new LocalStrategy(async (username, password, callback)=>{
  const arrayOfDocuments = await Patient.find({username: username})
  if (arrayOfDocuments.length === 0){return callback(null, false, {message: "Patient not found..."})}

  const userObject = arrayOfDocuments[0]
  bcrypt.compare(password, userObject.password, (err, result)=>{
    if (result == true){
      return callback(null, userObject)
    }else{
      return callback(null, false, {message: "Incorrect password..."})
    }
  })
});


module.exports = patientStrategy
