// FORM VALIDATION + RAISING ERRORS 
const validateSignInForm = (formData) => {
  const errors = {};
  if(!formData.email)
    errors.email = "Email is required!";

  if(!formData.password)
    errors.password = "Password is required!";

  return errors;
};

module.exports = validateSignInForm;