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

const validateUpdateData = (req) => {
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

  //consition for limited  skills
  if (req.body.skills.length >= 10) {
    const errorMessage =
      "You can only add a maximum of 10 skills. Please remove some skills and try again.";
    throw new Error(errorMessage);
  }
};

module.exports = {
  validateSignUpData,
  validateUpdateData,
};
