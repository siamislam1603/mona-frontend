// FORM VALIDATION + RAISING ERRORS 
const validateResetPassword = (formData) => {
    const errors = {};
    if(!formData.email)
      errors.email = "Email is required!"; 
    if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email))) 
    {  
        errors.validemail= "Enter a valid email"
    }
    return errors;
  };
  
  module.exports = validateResetPassword;