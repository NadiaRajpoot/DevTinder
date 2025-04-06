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
  const { mobileNumber, gender, photoURL, about, skills, age } = req.body;

  // Check if mobile number is valid
  if (mobileNumber && !validator.isMobilePhone(mobileNumber)) {
    throw new Error(
      "Invalid mobile number! Please enter a valid phone number."
    );
  }

  // Check if gender is valid
  if (gender && !["male", "female", "others"].includes(gender)) {
    throw new Error(
      "Invalid gender! Please select 'male', 'female', or 'others'."
    );
  }
  // Check if photo URL is valid
  if (photoURL && !validator.isURL(photoURL)) {
    throw new Error("Invalid photo URL! Please provide a valid URL.");
  }

  // Check if 'about' section is valid length
  if (about && !validator.isLength(about, { min: 0, max: 100 })) {
    throw new Error(
      "Invalid 'about' section! Please ensure it contains a maximum of 100 characters."
    );
  }
  console.log("Validating profile update data...");

  // Check if skills count exceeds limit
  if (skills && skills.length > 100) {
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
    "age",
    "firstName",
    "lastName",
  ];
  const requestedUpdates = Object.keys(req.body);

  // Check if all requested updates are allowed
  const isAllowedUpdates = requestedUpdates.every((k) =>
    ALLOWED_UPDATES.includes(k)
  );

  if (!isAllowedUpdates) {
    const notAllowedUpdates = requestedUpdates.filter(
      (k) => !ALLOWED_UPDATES.includes(k)
    );
    const errorMessage = `You are trying to update the following keys which are not allowed: ${notAllowedUpdates.join(
      ", "
    )}`;

    console.log("Not allowed updates:", notAllowedUpdates);

    // Throw an error with the detailed message
    throw new Error("errorrr" + errorMessage);
  }

  console.log("Validation successful!");
  return true; // Validation passed, return true
};

module.exports = {
  validateSignUpData,
  validateProfileUpdateData,
};
