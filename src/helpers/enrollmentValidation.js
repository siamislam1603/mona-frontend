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
    errors.fullname = " Please complete mandatory field!";

  if(fullname.length > 0 && !(/^[a-zA-Z ]+$/i.test(fullname)))
    errors.fullname = "Field shouldn't contain numbers & special characters!"

  if(!family_name)
    errors.family_name = "Please complete mandatory field!";
  
  if(!(/^[a-zA-Z ]+$/i.test(family_name)))
    errors.family_name = "Field shouldn't contain numbers & special characters!"

  if(!dob)
    errors.dob = "Please complete mandatory field!";

  if(!home_address)
    errors.home_address = "Please complete mandatory field!";

  if(!language)
    errors.language = "Please complete mandatory field!"

  if(!country_of_birth)
    errors.country_of_birth = "Please complete mandatory field!"

  return errors;
};

export const parentFormValidator = (parentForm) => {
  let errors = {};
  let {
    family_name,
    given_name,
    usually_called,
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
    errors.family_name = "Please complete mandatory field!";

  if(family_name.length > 0 && !(/^[a-zA-Z ]+$/i.test(family_name)))
    errors.fullname = "Field shouldn't contain numbers & special characters!"

  if(!given_name)
    errors.given_name = "Please complete mandatory field!";

  if(given_name.length > 0 && !(/^[a-zA-Z ]+$/i.test(given_name)))
    errors.given_name = "Field shouldn't contain numbers & special characters!"

  if(!dob)  
    errors.dob = "Please complete mandatory field!";

  if(!address_as_per_child)
    errors.address_as_per_child = "Please complete mandatory field!";

  if(!telephone)
    errors.telephone = "Please complete mandatory field!";

  if(!(/^[0-9]+$/i.test(telephone)))
    errors.telephone = "Field should only contain digits!"; 

  if(!email)
    errors.email = "Please complete mandatory field!";

  if(!place_of_birth)
    errors.place_of_birth = "Please complete mandatory field!";

  if(!ethnicity)
    errors.ethnicity = "Please complete mandatory field!";

  if(!primary_language)
    errors.primary_language = "Please complete mandatory field!";

  if(!occupation)
    errors.occupation = "Please complete mandatory field!";

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
    errors.medical_service = "Please complete mandatory field!";

  if(medical_service.length > 0 && !(/^[a-zA-Z ]+$/i.test(medical_service)))
    errors.medical_service = "Field shouldn't contain numbers & special characters."

  if(!telephone)  
    errors.telephone = "Please complete mandatory field!";

  if(telephone.length > 0 && !(/^[0-9]+$/i.test(telephone)))
    errors.telephone = "Field should only contain digits!";  

  if(!medical_service_address)
    errors.medical_service_address = "Please complete mandatory field!";
  
  if(!maternal_and_child_health_centre)
    errors.maternal_and_child_health_centre = "Please complete mandatory field!";
    
  return errors;
};