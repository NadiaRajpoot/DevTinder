const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength:3,
    maxLength:50,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    required: true,
    lowercase:true,
    trim:true,
    uinque:true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    validate(value){
     if(value<=18){
      throw new Error("age must be greater than 18")
     }
    },
  },
  phone:{
    type: String,
     validate:{
      validator: function(value){
        return /\d{3}-\d{3}-\d{4}/.test(value);
      },
       message: props => `${props.value} is not a valid phone number!`
     },
  //   validate: [validateEmail = function(value) {
  //     var re =/\d{3}-\d{3}-\d{4}/;
  //     return re.test(value)
  // }, ' not a valid phone number!'],
     required:[true , "User phone number required"]
  },
  gender: {
    type: String,
    validate(value){
      if(!["male","female","others"].includes(value)){
        throw new Error("Enter the valid gender")
      }
    }
  },
  about:{
    type: String,
    default:"This is a default about!"
  },
   photoURL:{
    type: String,
    default:"https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png"
   },
   skills:{
    type:[String],

   },
  
}, {
  timestamps:true
 },
);

module.exports = mongoose.model("User" , userSchema);