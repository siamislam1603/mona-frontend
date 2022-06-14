// FORM VALIDATION + RAISING ERRORS 
const validateForm = (formData) => {
  const errors = {};
  if(!formData.file) 
    errors.file = "User image is required!";

  if(!formData.fullname)
    errors.fullname = "Name is required!";

  if(!formData.role)
    errors.role = "User Role is required!";
  
  if(!formData.city)
    errors.city = "City is required!";

  if(!formData.address)
    errors.address = "Address is required!";

  if(!formData.email)
    errors.email = "Email is required!";

  if(!formData.phone || !formData.telcode)
    errors.phone = "Contact with Telephone-code is required!";

  return errors;
};

module.exports = validateForm;