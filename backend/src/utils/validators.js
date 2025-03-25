const { body, validationResult } = require("express-validator");

const validateEmail = () => {
  return body("email")
    .isEmail()
    .withMessage("Please enter a valid email address");
};

const validateRegistration = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Please enter a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const validateLogin = [
  body("email").isEmail().withMessage("Please enter a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

const validateCampaignData = () => {
  return [
    body("name").notEmpty().withMessage("Campaign name is required"),
    body("subject").notEmpty().withMessage("Email subject is required"),
    body("recipients")
      .isArray()
      .withMessage("Recipients must be an array of email addresses")
      .custom((value) => {
        for (let email of value) {
          if (!validateEmail(email)) {
            throw new Error("Invalid email address in recipients");
          }
        }
        return true;
      }),
  ];
};

const validateTemplateData = () => {
  return [
    body("title").notEmpty().withMessage("Template title is required"),
    body("content").notEmpty().withMessage("Template content is required"),
  ];
};

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateEmail,
  validateCampaignData,
  validateTemplateData,
  validateRequest,
  validateRegistration,
  validateLogin,
};
