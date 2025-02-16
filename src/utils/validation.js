const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Enter the valid email!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter the strong password!");
  }
};

const validateProfileUpdateData = (req) => {
  const { mobileNumber, gender, photoURL, about, skills } = req.body;

  if (!validator.isMobilePhone(mobileNumber)) {
    throw new Error(
      "Invalid mobile number! Please enter a valid phone number."
    );
  } else if (!["male", "female", "others"].includes(gender)) {
    throw new Error(
      "Invalid gender! Please select 'male', 'female', or 'others'."
    );
  } else if (!validator.isURL(photoURL)) {
    throw new Error("Invalid photo URL! Please provide a valid URL.");
  } else if (!validator.isLength(about, { min: 0, max: 100 })) {
    throw new Error(
      "Invalid 'about' section! Please ensure it contains a maximum of 100 characters."
    );
  } else if (skills.length > 10) {
    throw new Error(
      "Skill limit exceeded! You can only add up to 10 skills. Please remove some skills and try again."
    );
  }

  const ALLOWED_UPDATES = [
    "photoURL",
    "skills",
    "about",
    "gender",
    "mobileNumber",
  ];
  // Get the keys from the request body
  const requestedUpdates = Object.keys(req.body);

  // Check if all requested updates are allowed
  const isAllowedUpdates = requestedUpdates.every((k) =>
    ALLOWED_UPDATES.includes(k)
  );

  if (!isAllowedUpdates) {
    // Find the keys that are not allowed
    const notAllowedUpdates = requestedUpdates.filter(
      (k) => !ALLOWED_UPDATES.includes(k)
    );
    const errorMessage = `You are trying to update the following keys which are not allowed: 
        ${notAllowedUpdates.join(", ")}`;

    // Throw an error with the detailed message
    throw new Error(errorMessage);
  }
};

module.exports = {
  validateSignUpData,
  validateProfileUpdateData,
};
