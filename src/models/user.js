const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "firstName is required!"],
      minLength: 3,
      maxLength: 50,
    },

    lastName: {
      type: String,
      required: [true, "lastName is required!"],
    },

    emailId: {
      type: String,
     
      lowercase: true,
      trim: true,
      unique: [true, "Email Id  is already exists"],
      validate: {
        validator: (email) => validator.isEmail(email),
        message: "Please provide a valid email address.",
      },
    },


    password: {
      type: String,
      validate: {
        validator: (password) => validator.isStrongPassword(password),
        message: "Enter a strong password!",
      },
      required: [true, "Password is requuired!"],
    },

    age: {
      type: String,
      validate(value) {
        if (value <= 18) {
          throw new Error("age must be greater than 18");
        }
      },
    },

    mobileNumber: {
      type: String,
      validate: {
        validator: (phoneNumber) => validator.isMobilePhone(phoneNumber),
        message: "Enter a valid mobile number!",
      },
    },

    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Enter the valid gender");
        }
      },
    },

    about: {
      type: String,
      default: "This is a default about!",
    },

    photoURL: {
      type: String,
      validate: {
        validator: (URL) => validator.isURL(URL),
        message: "Enter a valid photo URL!",
      },

      default:
        "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png",
    },
    skills: {
      type: [String],
      
    },
    city: {
      type: String,
      required : [true  , "city is required field"],
      default: "karachi"
    },

    country: {
      type: String,
      required : [true  , "country / region is required field"],
      default : "Pakistan"
    },
    headline: {
      type: String,
      required : [true  , "Headline is required field"],
      default: "This is default headline"
    },

    coverPhotoURL: {
      type: String,
      validate: {
        validator: (URL) => validator.isURL(URL),
        message: "Enter a valid photo URL!",
      },

      default:
        "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG.png",
    },
    },
  
  {
    timestamps: true,
  }
);

userSchema.methods.getJwt = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "DevTinder@4444#", {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (userInputPassword) {
  const passwordHash = this.password;
  const isPasswordValid = await bcrypt.compare(userInputPassword, passwordHash);
  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
