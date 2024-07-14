const LocalStrategy = require("passport-local");
const Doctor = require("../models/Doctor")
const bcrypt = require("bcrypt");


const doctorStrategy = new LocalStrategy(async (username, password, callback)=>{

  const arrayOfDocuments = await Doctor.find({username: username});
  if (arrayOfDocuments.length === 0){return callback(null, false, {message: "Account not found..."})}

  const doctorObject = arrayOfDocuments[0]
  bcrypt.compare(password, doctorObject.password, (err, result)=>{
    if (result == true){
      return callback(null, doctorObject);
    }else{
      return callback(null, false, {message: "Incorrect password..."});
    }
  })
});

module.exports = doctorStrategy
