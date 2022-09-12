export const childFormValidator = (childForm, inclusionSupportForm) => {
  let errors = {};
  let {
    fullname,
    family_name,
    usually_called,
    dob,
    home_address,
    language,
    country_of_birth,
    child_medical_no,
    child_crn,
    parent_crn_1,
    developmental_delay,
    parent_crn_2
  } = childForm;

  if(!fullname)
    errors.fullname = " Please complete mandatory field";

  if(fullname.length > 0 && !(/^[a-zA-Z ]+$/i.test(fullname)))
    errors.fullname = "Field shouldn't contain numbers & special characters"

  if(!family_name)
    errors.family_name = "Please complete mandatory field";

  if(usually_called.length > 0 && !(/^[a-zA-Z ]+$/i.test(usually_called)))
    errors.usually_called = "Field shouldn't contain numbers & special characters"
  
  if(family_name.length > 0 && !(/^[a-zA-Z ]+$/i.test(family_name)))
    errors.family_name = "Field shouldn't contain numbers & special characters"

  if(!dob)
    errors.dob = "Please complete mandatory field";

  if(!home_address)
    errors.home_address = "Please complete mandatory field";

  if(!language)
    errors.language = "Please complete mandatory field"

  if(!country_of_birth)
    errors.country_of_birth = "Please complete mandatory field"

  if(!child_medical_no)
    errors.child_medical_no = "Please complete mandatory field"
  
  if(developmental_delay === true && (!inclusionSupportForm || inclusionSupportForm.length === 0))
    errors.supportForm = "Please insert physical disability form."

  if(!child_crn)
    errors.child_crn = "Please complete mandatory field"
  
  if(!parent_crn_1)
    errors.parent_crn_1 = "Please complete mandatory field"
  
  if(!parent_crn_2)
    errors.parent_crn_2 = "Please complete mandatory field"

  return errors;
};

export const parentFormValidator = (parentForm) => {
  let errors = {};
  let {
    parent_family_name,
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

  if(!parent_family_name)
    errors.family_name = "Please complete mandatory field";

  if(parent_family_name.length > 0 && !(/^[a-zA-Z ]+$/i.test(parent_family_name)))
    errors.fullname = "Field shouldn't contain numbers & special characters"

  if(!given_name)
    errors.given_name = "Please complete mandatory field";

  if(given_name.length > 0 && !(/^[a-zA-Z ]+$/i.test(given_name)))
    errors.given_name = "Field shouldn't contain numbers & special characters"

  if(!dob)  
    errors.dob = "Please complete mandatory field";

  if(!address_as_per_child)
    errors.address_as_per_child = "Please complete mandatory field";

  if(!telephone)
    errors.telephone = "Please complete mandatory field";

  if(telephone?.length > 0 && !(/^[0-9]+$/i.test(telephone)))
    errors.telephone = "Field should only contain digits"; 

  if(!email)
    errors.email = "Please complete mandatory field";

  if(!place_of_birth)
    errors.place_of_birth = "Please complete mandatory field";

  if(!ethnicity)
    errors.ethnicity = "Please complete mandatory field";

  if(!primary_language)
    errors.primary_language = "Please complete mandatory field";

  if(!occupation)
    errors.occupation = "Please complete mandatory field";

  return errors;
};

export const healthInformationFormValidator = (
  healthInformationForm, 
  i_give_medication_permission,
  has_court_orders,
  courtOrderDetails,
  has_been_immunised,
  immunisationRecordDetails,
  inclusion_support_form_of_special_needs,
  specialNeedsFormDetails,
  inclusion_support_form_of_allergies,
  allergyFormDetails,
  has_anaphylaxis_medical_plan_been_provided,
  medicalPlanDetails
) => {
  let errors = {};
  let {
    medical_service,
    telephone,
    medical_service_address,
    maternal_and_child_health_centre,
  } = healthInformationForm;

  if(!medical_service)  
    errors.medical_service = "Please complete mandatory field";

  if(medical_service.length > 0 && !(/^[a-zA-Z ]+$/i.test(medical_service)))
    errors.medical_service = "Field shouldn't contain numbers & special characters"

  if(!telephone)  
    errors.telephone = "Please complete mandatory field";

  if(telephone.length > 0 && !(/^[0-9]+$/i.test(telephone)))
    errors.telephone = "Field should only contain digits";  

  if(!medical_service_address)
    errors.medical_service_address = "Please complete mandatory field";
  
  if(!maternal_and_child_health_centre)
    errors.maternal_and_child_health_centre = "Please complete mandatory field";

  if(i_give_medication_permission === false)
    errors.i_give_medication_permission = "Please give medication consent"
  
  if(has_court_orders === true && (!courtOrderDetails || courtOrderDetails.length === 0))
    errors.courtOrders = "Please insert court orders."
  
  if(has_been_immunised === true && (!immunisationRecordDetails || immunisationRecordDetails.length === 0))
    errors.immunisationRecord = "Please insert immunisation record."
  
  if(inclusion_support_form_of_special_needs === true && (!specialNeedsFormDetails || specialNeedsFormDetails.length === 0))
    errors.specialNeeds = "Please insert special needs form."
  
  if(inclusion_support_form_of_allergies === true && (!allergyFormDetails || allergyFormDetails.length === 0))
    errors.allergyError = "Please insert allergy detail form."
  
  if(has_anaphylaxis_medical_plan_been_provided === true && (!medicalPlanDetails || medicalPlanDetails.length === 0))
    errors.medicalPlan = "Please insert medical plan."

  return errors;
};