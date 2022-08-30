export const childFormValidator = (childForm) => {
  let errors = {};
  let {
    fullname,
    family_name,
    dob,
    home_address,
    language,
    country_of_birth
  } = childForm;

  if(!fullname)
    errors.fullname = "Full Name is required!";

  if(!(/^[a-zA-Z ]+$/i.test(fullname)))
    errors.fullname = "Name shoudln't contain numbers & special characters."

  if(!family_name)
    errors.family_name = "Family Name is required!";
  
  if(!(/^[a-zA-Z ]+$/i.test(family_name)))
    errors.family_name = "Name shoudln't contain numbers & special characters."

  if(!dob)
    errors.dob = "Date of Birth is required!";

  if(!home_address)
    errors.home_address = "Home address is required!";

  if(!language)
    errors.language = "Choose a language that you speak!"

  if(!country_of_birth)
    errors.country_of_birth = "Country of birth is required!"

  return errors;
};

export const parentFormValidator = (parentForm) => {
  let errors = {};
  let {
    family_name,
    given_name,
    dob,
    address_as_per_child,
    telephone,
    email,
    place_of_birth,
    ethnicity,
    primary_language,
    occupation,
  } = parentForm;

  if(!family_name)
    errors.family_name = "Family Name is required!";

  if(!(/^[a-zA-Z ]+$/i.test(family_name)))
    errors.family_name = "Name shoudln't contain numbers & special characters."

  if(!given_name)
    errors.given_name = "Given name is required!";

  if(!(/^[a-zA-Z ]+$/i.test(given_name)))
    errors.given_name = "Name shouldn't contain numbers & special characters."

  if(!dob)  
    errors.dob = "Date of birth is required!";

  if(!address_as_per_child)
    errors.address_as_per_child = "Address is required!";

  if(!telephone)
    errors.telephone = "Telephone number is required!";

  if(!(/^[0-9]+$/i.test(telephone)))
    errors.telephone = "Telephone should only contain digits!"; 

  if(!email)
    errors.email = "Email is required!";

  if(!place_of_birth)
    errors.place_of_birth = "Choose a place of birth!";

  if(!ethnicity)
    errors.ethnicity = "Choose your ethnicity!";

  if(!primary_language)
    errors.primary_language = "Choose your primary language!";

  if(!occupation)
    errors.occupation = "Choose an occupation!";

  return errors;
};

export const healthInformationFormValidator = (healthInformationForm) => {
  let errors = {};
  let {
    medical_service,
    telephone,
    medical_service_address,
    maternal_and_child_health_centre,
  } = healthInformationForm;

  if(!medical_service)  
    errors.medical_service = "Doctor's Name/Medical Service is required!";

  if(!(/^[a-zA-Z ]+$/i.test(medical_service)))
    errors.medical_service = "Name shouldn't contain numbers & special characters."

  if(!telephone)  
    errors.telephone = "Telephone number is required!";

  if(!(/^[0-9]+$/i.test(telephone)))
    errors.telephone = "Telephone should only contain digits!";  

  if(!medical_service_address)
    errors.medical_service_address = "Medical Service address is required!";
  
  if(!maternal_and_child_health_centre)
    errors.maternal_and_child_health_centre = "Maternal and Child health centre is required!";
    
  return errors;
};