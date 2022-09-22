import moment from 'moment';

export const DynamicFormValidation = (
  form,
  data,
  behalf_of,
  behalf_of_flag,
  signature_access_flag
) => {
  console.log("signature_access_flag",signature_access_flag);
  let newErrors = {};
  Object.keys(data)?.map((item) => {
    // console.log('inner_item_item--->', item);
    data[item].map((inner_item) => {
      // console.log('inner_item', form[item]);

      
      
      if (inner_item.required) {
        if(inner_item.field_type==="signature" && signature_access_flag===true && !form[item][`${inner_item.field_name}`])
        {
          newErrors[
            `${inner_item.field_name}`
          ] = `${inner_item.field_label} is required`;
        }
        else{
          if (inner_item.field_type!=="signature" && !form[item][`${inner_item.field_name}`]) {
            newErrors[
              `${inner_item.field_name}`
            ] = `${inner_item.field_label} is required`;
          }
        }
        
        
      }
    });
  });
  if (behalf_of_flag === true) {
    if (!behalf_of || behalf_of === '')
      newErrors.behalf_of = 'Behalf of is required';
  }
  return newErrors;
};
export const createCategoryValidation = (form) => {
  let newErrors = {};
  let { category_name, order } = form;
  if (!category_name || category_name === '')
    newErrors.category_name = 'Category Name is Required';
  if (order <= 0) newErrors.order = 'Order must be greater than 0';
  if (!order || order === '') newErrors.order = 'Position is Required';
  return newErrors;
};
export const createFormSettingModelValidation = (form, franchisee, user) => {
  let newErrors = {};
  let {
    start_date,
    start_time,
    end_date,
    end_time,
    applicable_to_user,
    applicable_to_franchisee,
  } = form;
  if (!start_date || start_date === '')
    newErrors.start_date = 'Start Date is Required';
  if (!start_time || start_time === '')
    newErrors.start_time = 'Start Time is Required';
  if (!end_date || end_date === '') newErrors.end_date = 'End Date is Required';
  if (!end_time || end_time === '') newErrors.end_time = 'End Time is Required';
  if (applicable_to_user === 'No' || applicable_to_user === false) {
    if (user.length === 0) newErrors.user = 'Applicable to User is Required';
  }
  if (applicable_to_franchisee === 'No' || applicable_to_franchisee === false) {
    if (franchisee.length === 0)
      newErrors.franchisee = 'Applicable to Franchise is Required';
  }
  console.log('newerrors----->', newErrors);
  return newErrors;
};
export const createFormFieldValidation = (form) => {
  let newErrors = [{}];
  console.log('field label---->', form[0]?.field_label);
  for (let i = 0; i < form.length; i++) {
    if (!newErrors[i]) {
      newErrors[i] = {};
    }
    let { field_label, field_type, option } = form[i];
    console.log('field label-xdbvgfdsds--->', field_label);
    if (!field_label || field_label === '') {
      newErrors[i].field_label = 'Field Label is Required';
    }
    if (
      field_type === 'radio' ||
      field_type === 'checkbox' ||
      field_type === 'dropdown_selection'
    ) {
      for (let j = 0; j < option.length; j++) {
        console.log('Object.keys(option[j])---->', Object.keys(option[j])[0]);
        if (Object.keys(option[j])[0] === '') {
          if (!newErrors[i].option) {
            newErrors[i].option = [];
          }
          newErrors[i].option.push(`Option ${j + 1} is Required`);
        } else {
          if (!newErrors[i].option) {
            newErrors[i].option = [];
          }
          newErrors[i].option.push(``);
        }
      }
    }
    console.log('new Errors----->', newErrors);
  }

  return newErrors;
};
export const createFileRepoValidation = (form) => {
  let newErrors = {};
  let { file_category, meta_description, setting_files } = form;
  if (!file_category || file_category === '') {
    newErrors.file_category = 'File Category is Required';
  }
  if (!meta_description || meta_description === '') {
    newErrors.meta_description = 'Meta Description is Required';
  }
  if (!setting_files || setting_files === '') {
    newErrors.setting_files = 'File is Required';
  }

  return newErrors;
};
export const createFormValidation = (form) => {
  let newErrors = {};
  let {
    form_name,
    form_type,
    form_description,
    form_template_select,
    previous_form,
    category_id,
  } = form;

  if (!form_name || form_name === '')
    newErrors.form_name = 'Form Title is Required';
  if (!form_type || form_type === '')
    newErrors.form_type = 'Form Type is Required';
  if (!form_description || form_description === '')
    newErrors.form_description = 'Form Description is Required';
  if (form_template_select === 'Yes')
    if (!previous_form || previous_form === '')
      newErrors.previous_form = 'Previous Form is Required';
  if (!category_id || category_id === '')
    newErrors.category_id = 'Category is Required';

  return newErrors;
};
export const createOperatingManualValidation = (form,wordCount) => {
  let newErrors = {};
  let { title, description, order } = form;
  if (!title || title === '') newErrors.title = 'Title is Required';
  if (order < 0) newErrors.order = 'Order must be greater than 0';
  if (order === 0 || order === '0')
    newErrors.order = 'Order must be greater than 0';
  if (!order || order === '') newErrors.order = 'Position is Required';
  if (!description || description === '')
    newErrors.description = 'Description is Required';
  if(wordCount>500){
    newErrors.description = 'Description count is more than 500';
  }
  return newErrors;
};
//Validation for edit annoutment

export const AddNewAnnouncementValidation = (form, coverImage, allFranchise,titleError,titleChecking) => {
  console.log('The form validation', titleError,titleChecking);
  let newErrors = {};
  console.log('The form validat', form);
  let { title, meta_description, start_date, start_time, franchise } = form;
  console.log('The tile valdiation', start_date);
  if (!title || title === ' ')
    newErrors.title = 'Announcement Title is Required ';
  // if (!coverImage)newErrors.coverImage = 'Cover image is Required';
  let reg = /^\s|\s$/
  
 if(title){
  if(title.match(reg)){
    // console.log("contains spaces");
    newErrors.title = 'Contain unwanted space';
     
    }
 } 
 
  
  if (!start_date || start_date === 'undefined')
    newErrors.start_date = 'Start Date Required';
  if (!start_time || start_time === 'undefined')
    newErrors.start_time = 'Start Time Required';
  if (!meta_description || meta_description === ' ')
    newErrors.meta_description = 'Announcement Description is Required';


  // if(meta_description.match(reg)){
     
  //     newErrors.meta_description = 'Contain unwanted space';     
  // }
  if (!franchise || franchise.length === 0) {
    if (!allFranchise) {
      newErrors.franchise = "Please Select Franchise"

    }

  }


  return newErrors;
};
export const EditAnnouncementValidation = (form, coverImage, Data, allFranchise) => {
  let newErrors = {};
  console.log('The form validat', form,allFranchise);
  // console.log("The DATA VALIDATION",newData)
  let { title, meta_description, start_date, start_time, franchise } = form;

  console.log('All valiatiion', title, start_date, meta_description);
  if (!title || title === ' ') newErrors.title = 'Title is Required';
  let reg = /^\s|\s$/
  if(title){
    if(title.match(reg)){
      // console.log("contains spaces");
      newErrors.title = 'Contain unwanted space';
       
      }
   } 
  // if (!coverImage || coverImage === '')newErrors.coverImage = 'Cover image is Required';
  if (!meta_description || meta_description === ' ')
    newErrors.meta_description = 'Description is Required';

    if(meta_description.match(reg)){
      // console.log("contains spaces");
      newErrors.meta_description = 'Contain unwanted space';
      } 
  if ((start_date === ' ' && !start_date) || start_date === ' ')
    newErrors.start_date = 'Start Date Required';
  if ((start_time === ' ' && !start_time) || start_time === ' ')
    newErrors.start_time = 'Start Time Required';
  if (!franchise || franchise.length === 0) {
    if (!allFranchise) {
      newErrors.franchise = "Please Select Franchise"

    }

  }
  return newErrors;
};
export const ChildRegisterFormValidation = (form) => {
  let newErrors = {};
  let {
    child_name,
    family_name,
    given_name,
    usually_called,
    dob,
    country_of_birth,
    home_address,
    languages_spoken_in_home,
  } = form;
  if (!child_name) {
    newErrors.child_name = 'Child name is required';
  }
  if (!family_name) {
    newErrors.family_name = 'Family name is required';
  }
  if (!given_name) {
    newErrors.given_name = 'Given name is required';
  }
  if (!usually_called) {
    newErrors.usually_called = 'Usually called is required';
  }
  if (!dob) {
    newErrors.dob = 'Date of Birth is required';
  }
  if (!country_of_birth) {
    newErrors.country_of_birth = 'Country of Birth is required';
  }
  if (!home_address) {
    newErrors.home_address = 'Home Address is required';
  }
  if (!languages_spoken_in_home) {
    newErrors.languages_spoken_in_home = 'Language spoken in home is required';
  }
  return newErrors;
};

export const TrainingFormValidation = (form) => {
  let errors = {};
  let {
    title,
    category_id,
    description,
    meta_description,
    time_required_to_complete,

  } = form;

  if (!title) {
    errors.title = 'Training title is required';
  }

  if (title <= 2) {
    errors.title_length = 'Training title should be more than 2 characters';
  }

  if (!category_id) {
    errors.category_id = 'Training category  is required';
  }

  if (!description) {
    errors.description = 'Training description is required';
  }

  if (!meta_description) {
    errors.meta_description = 'Meta description is required';
  }

  if (!time_required_to_complete) {
    errors.time_required_to_complete = 'Training time is required';
  }

  // if (!croppedImage) {
  //   errors.croppedImage = 'Image time is required!';
  // }
  // croppedImage
  // if (Object.keys(croppedImage).length === 0) {
  //   errors.croppedImage = 'Cover image required!';
  // }
  return errors;
};

// <<<<<<< HEAD

// export const EditFleRepo = (form, coverImage) => {
//   let errors = {};
//   let {
//     id,
//     title,
//     description,
//     categoryId,
//     assigned_users,
//     assigned_roles,
//   } = form;

//   if (!title) {
//     errors.title = ' title is required!';
//   }

// =======

export const EditFleRepo = (form, coverImage) => {
  let errors = {};
  let { id, title, description, categoryId, assigned_users, assigned_roles } =
    form;

  if (!title) {
    errors.title = ' title is required';
  }

  // >>>>>>> master
  if (title <= 2) {
    errors.title_length = ' title should be more than 2 characters.';
  }

  if (!description) {
    errors.description = 'Training description is required';
  }

  if (!categoryId) {
    errors.categoryId = 'categoryid  is required';
  }

  if (!assigned_users) {
    errors.assigned_users = 'assigned_user time is required';
  }

  if (!assigned_roles) {
    errors.assigned_roles = 'user_roles time is required';
  }

  if (Object.keys(coverImage).length === 0) {
    errors.coverImage = 'Cover image required';
  }
  return errors;
};

export const PasswordValidation = (form) => {
  let errors = {};
  let regex = new RegExp('(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$' )
  let { oldpassword, new_password, confirm_password } = form;

  if (!oldpassword) {
    errors.oldpassword = 'Old password is required';
  }
  if (!new_password) {
    errors.new_password = 'New Password is required';
  }
  if (new_password && !regex.test(new_password)) {
    errors.new_password = 'Minimum 8 characters, at least one letter, one number and one special character'

    // "^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"

  }

  if (!confirm_password) {
    errors.confirm_password = 'Confirm password';
  }
  if (new_password && confirm_password && new_password !== confirm_password) {
    errors.new_password = 'New password and Confirm password need to be same';
    errors.confirm_password =
      'New password and Confirm password need to be same';
  }
  if (oldpassword && new_password && oldpassword === new_password) {
    errors.new_password = 'Old and New Password need to be different';
    errors.oldpassword = 'Old and New Password need to be different';
  }

  return errors;
};
export const ResetPasswordValidation = (form) => {
  let errors = {};
  let regex = new RegExp('(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$' )

  let { new_password, confirm_password } = form;
  if (!new_password) {
    errors.new_password = 'New password require';
  }
  if (new_password && !regex.test(new_password)) {
    errors.new_password = 'Minimum 8 characters, at least one letter, one number and one special character'

    // "^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"

  }
  if (!confirm_password) {
    errors.confirm_password = 'Confirm password require';
  }
  if (new_password && confirm_password && new_password !== confirm_password) {
    errors.new_password = 'New password and Confirm password need to be same';
    errors.confirm_password =
      'New password and Confirm password need to be same';
  }
  return errors;
};
export const FranchiseeFormValidation = (formObj) => {
  let errors = {};
  let {
    franchisee_name,
    abn,
    city,
    state,
    franchisee_number,
    acn,
    postcode,
    address,
    contact,
  } = formObj;

  if (!franchisee_name) {
    errors.franchisee_name = 'Franchise name is required';
  }

  if (!franchisee_number) {
    errors.franchisee_number = 'Franchise number is required';
  }
  
  if (!abn) {
    errors.abn = 'Australian business number is required';
  }

  if(abn.length > 0 && (/^[a-zA-Z ]+$/i.test(abn)))
    errors.abn = "Field should only contain digits"
  
  if (!acn) {
    errors.acn = 'Australian company number is required';
  }

  if(acn.length > 0 && (/^[a-zA-Z ]+$/i.test(acn)))
    errors.acn = "Field should only contain digits"
  
  if (!city) {
    errors.city = 'Suburb is required';
  }

  if (!address) {
    errors.address = 'Address is required';
  }
  
  if (!state) {
    errors.state = 'State is required';
  }

  if (!postcode) {
    errors.postcode = 'Post code is required';
  }

  if (!contact) {
    errors.contact = 'Contact number is required';
  }

  if(contact?.length > 0 && !(/^[0-9]+$/i.test(contact)))
    errors.contact = "Field should only contain digits"; 

  return errors;
};

export const acceptPointValidator = (value) => {
  let errors = {};

  if(value === false)
    errors.value = "Please give your acknowledgement";

  return errors;
}

export const UserFormValidation = (formObj) => {
  let errors = {};
  let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');

  let { fullname, role, state, city, address, postalCode, crn, email, phone, franchisee, open_coordinator, coordinator } =
  formObj;
  
  if (!email) errors.email = 'Email address is required';

  if(email.length > 0 && !regex.test(email)) {
    errors.email = "Email format is invalid";
  }

  if (!role) errors.role = 'User role is required';
  
  if (!fullname) errors.fullname = 'Full name is required';

  if(fullname.length > 0 && !(/^[a-zA-Z ]+$/i.test(fullname)))
    errors.fullname = "Field shouldn't contain numbers & special characters"

  if(!state) errors.state = 'State is required';
  
  if (!city) errors.city = 'Suburb is required';

  if (!address) errors.address = 'Address is required';
  
  if (!postalCode) errors.postalCode = 'Post code is required';
  
  if(postalCode.length > 0 && postalCode.length < 4)
    errors.postalCode = 'Post code must be 4-digit long';

  if(postalCode.length === 4 && isNaN(parseInt(postalCode)))
    errors.postalCode = 'Post code must only consist digits';

  if (role === "guardian" && !crn) errors.crn = "CRN number is required";
  
  if (!phone) errors.phone = 'Phone number is required';
  
  if (!franchisee) errors.franchisee = 'Franchise is required';

  if(open_coordinator === true && role === 'educator' && !coordinator)
    errors.coordinator = 'Coordinator is required'

  return errors;
};

export const editUserValidation = (form) => {
  let errors = {};
  let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
  let regexPassword = new RegExp('(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}');
  let { address, city, crn, email, fullname, phone, role, postalCode, state, password, confirm_password } = form;
  
  if (!fullname) errors.fullname = 'Full name is required';
  
  if(fullname.length > 0 && !(/^[a-zA-Z ]+$/i.test(fullname)))
    errors.fullname = "Field shouldn't contain numbers & special characters"
  
  if (!email) errors.email = 'Email address is required';
  
  if(!state) errors.state = 'State is required';
  
  if (!city) errors.city = 'Suburb is required';

  if (!address) errors.address = 'Address is required';
  
  if (!postalCode) errors.postalCode = 'Post code is required';
  
  if(postalCode.length > 0 && postalCode.length < 4)
    errors.postalCode = 'Post code must be 4-digit long';

  if(postalCode.length === 4 && isNaN(parseInt(postalCode)))
    errors.postalCode = 'Post code must only consist digits';
  
  if (role === "guardian" && !crn) errors.crn = "CRN number is required";
  
  if(email.length > 0 && !regex.test(email)) {
    errors.email = "Email format is invalid";
  }

  if (!phone) errors.phone = 'Phone number is required';

  if(password && !regexPassword.test(password))
    errors.password = "Minimum 8 characters, at least 1 uppercase, 1 lowercase & 1 digit"

  if (password && password !== confirm_password) {
    errors.password = "Passwords don't match";
    errors.confirm_password = "Passwords don't match";
  }

  return errors;
}

export const personValidation = (personValidationForm) => {
  let errors = {};
  let { name, address, telephone, relationship_to_the_child } =
    personValidationForm;

  if (!name) errors.name = 'Please complete mandatory field';

  if (name.length > 0 && !(/^[a-zA-Z ]+$/i.test(name)))
    errors.name = 'Field shouldn\'t contain digits & special characters';

  if (!address) errors.address = 'Please complete mandatory field';

  if (!telephone) errors.telephone = 'Please complete mandatory field';

  if(telephone.length > 0 && !(/^[0-9]+$/i.test(telephone)))
    errors.telephone = "Field should only contain digits";

  if (!relationship_to_the_child)
    errors.relationship_to_the_child =
      'Please complete mandatory field!';

  if(relationship_to_the_child.length > 0 && !(/^[a-zA-Z ]+$/i.test(relationship_to_the_child)))
    errors.relationship_to_the_child = 'Field shouldn\'t contain digits & special characters';

  return errors;
};

export const personValidation2 = (personValidationForm) => {
  let errors = {};
  let { telephone } =
    personValidationForm;

  if(telephone.length > 0 && !(/^[0-9]+$/i.test(telephone)))
    errors.telephone = "Field should only contain digits";

  return errors;
}

// export const person2Validation = (obj) => {
//   let errors = {};
//   let { telephone } = obj;

//   if(telephone?.length > 1 && telephone?.length < 10)
//     errors.telephone = 'Telephone number must be at least 10-digit long'

//   return errors;
// };

export const digitalSignatureValidator = (form) => {
  let errors = {};
  let {
    consent_signature,
    consent_date
  } = form;
  let date = moment(consent_date);

  if(!consent_signature)
    errors.consent_signature = "Please provide your signature below";

  if(!date.isValid())
    errors.consent_date = "Please provide a date";

  return errors;
}


export const childDailyRoutineValidation = (childDailyRoutineForm) => {
  let errors = {};
  let {
    sleep_time,
    bottle_time,
    toileting,
    routines,
    likes_dislikes,
    comforter,
    religion,
    dietary_requirement,
    allergy,
    comment,
  } = childDailyRoutineForm;

  if (!sleep_time) errors.sleep_time = 'Please complete mandatory field';

  if (!bottle_time) errors.bottle_time = 'Please complete mandatory field';

  if (!toileting) errors.toileting = 'Please complete mandatory field';

  if (!routines) errors.routines = 'Please complete mandatory field';

  if (!likes_dislikes) errors.likes_dislikes = 'Please complete mandatory field';

  if (!comforter) errors.comforter = 'Please complete mandatory field';

  if (!religion) errors.religion = 'Please complete mandatory field';

  if (!dietary_requirement)
    errors.dietary_requirement = 'Please complete mandatory field';

  if (!allergy) errors.allergy = 'Please complete mandatory field';

  if (!comment) errors.comment = 'Please complete mandatory field';

  return errors;
};

export const enrollmentInitiationFormValidation = (
  formOneChildData
) => {
  let { fullname, family_name, dob, start_date, home_address, child_crn, school_status, name_of_school, educator, franchisee_id } = formOneChildData;
  let errors = {};

  if (!fullname) errors.fullname = 'Fullname is required';

  if (!family_name) errors.family_name = 'Family name is required'

  if (!dob) errors.dob = 'Date of birth is required';

  if (!start_date) errors.start_date = 'Start date is required'

  if (!home_address) errors.home_address = 'Home address is required';

  if (!franchisee_id) errors.franchiseData = 'Franchise is required';
  
  if (educator.length === 0) errors.educatorData = 'Educator is required';
  
  if (!child_crn) errors.child_crn = 'Child CRN is required';

  if (school_status === "Y" && !name_of_school) errors.name_of_school = "School name is required";


  return errors;
};
