const LocalStrategy = require("passport-local");
const Doctor = require("../models/Doctor")
const bcrypt = require("bcrypt");


const doctorStrategy = new LocalStrategy((username, password, callback)=>{

});

module.exports = doctorStrategy
