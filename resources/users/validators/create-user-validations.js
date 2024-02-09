const {
    validate,
    notEmpty,
    shouldBeUuid,
    isEmail,
    isMobileNumber,
  } = require("validation");
  
  const rule = {

    username: [
      [notEmpty, "Username is required"],
  ],
    password: [
      [notEmpty, "Password is required"],
    ],

    
  };
  
  module.exports.validate= async data => validate(rule, data);