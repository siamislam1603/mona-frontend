export const DynamicFormValidation = (form, data) => {
  let newErrors = {};
  data.map((item) => {
    console.log('item.required', item.required);
    if (item.required) {
      if (!form[`${item.field_name}`]) {
        newErrors[`${item.field_name}`] = `${item.field_label} is required`;
      }
    }
  });
  return newErrors;
};
export const createCategoryValidation = (form) => {
  let newErrors = {};
  let { category_name } = form;
  if (!category_name || category_name === '')
    newErrors.category_name = 'Category Name is Required';
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
      newErrors.franchisee = 'Applicable to Franchisee is Required';
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
export const createFileRepoValidation = (form, franchisee, user) => {
  let newErrors = {};
  let { applicable_to_user, applicable_to_franchisee, setting_files } = form;
  if (applicable_to_user === '0') {
    if (user === '') newErrors.user = 'Applicable to User is Required';
  }
  if (applicable_to_franchisee === '0') {
    if (franchisee === '')
      newErrors.franchisee = 'Applicable to Franchisee is Required';
  }
  if (!setting_files || setting_files === '')
    newErrors.setting_files = 'File is Required';

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
  return newErrors;
};
export const createOperatingManualValidation = (form,imageUrl,videoUrl) => {
  let newErrors = {};
  let { title, description } = form;
  if (!title || title === '') newErrors.title = 'Title is Required';
  if (!description || description === '')
    newErrors.description = 'Description is Required';
  if (!imageUrl || imageUrl === '')
    newErrors.cover_image = 'Cover image is Required';
  if (!videoUrl || videoUrl === '')
    newErrors.reference_video = 'Reference video is Required';

  return newErrors;
};
//Validation for edit annoutment

export const AddNewAnnouncementValidation = (form) =>{
  let newErrors = {};
  console.log("The form validat", form)
  let { announcement_title,announcement_description,cover_image} = form;
  console.log("The tile valdiation", announcement_title)
  if(!announcement_title || announcement_title === ' ') newErrors.announcement_title="Title is Required"
  if (!cover_image || cover_image === '')newErrors.cover_image = 'Cover image is Required';
  if(!announcement_description || announcement_description === ' ') newErrors.announcement_description="Description is Required"
  
  return newErrors;

}
export const EditAnnouncementValidation = (form) =>{
  let newErrors = {};
  console.log("The form validat", form)
  let { announcement_title,meta_description,cover_image} = form;
  console.log("The tile valdiation", announcement_title)
  if(!announcement_title || announcement_title === ' ') newErrors.announcement_title="Title is Required"
  if (!cover_image || cover_image === '')newErrors.cover_image = 'Cover image is Required';
  if(!meta_description || meta_description === ' ') newErrors.meta_description="Description is Required"
  
  return newErrors;
}
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


export const TrainingFormValidation = (form, coverImage) => {
  let errors = {};
  let {
    title,
    description,
    meta_description,
    category_id,
    time_required_to_complete,
  } = form;

  if (!title) {
    errors.title = 'Training title is required!';
  }
  
  if (!description) {
    errors.description = 'Training description is required!';
  }
  
  if (!meta_description) {
    errors.meta_description = 'Meta description is required!';
  }
  
  if (!category_id) {
    errors.category_id = 'Training category title is required!';
  }
  
  if (!time_required_to_complete) {
    errors.time_required_to_complete = 'Training time is required!';
  }

  if(Object.keys(coverImage).length === 0) {
    errors.coverImage = 'Cover image required!';
  }

  return errors;
};

export const PasswordValidation = (form) => {
 let errors = {};
  let {
    oldpassword,
    new_password,
    confirm_password
  } = form;
  if (!oldpassword) {
    errors.oldpassword = 'oldpassword is required!';
  }
  if(!new_password){
    errors.new_password = 'new Password is required'
  }
  if(!confirm_password){
    errors.confirm_password = 'confirm password'
  }
  if(new_password && confirm_password && new_password != confirm_password ){
      errors.new_password = "new password and confirm password need to be same"
      errors.confirm_password = "new password and confirm password need to be same"
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
    franchisee_admin_email,
    franchisee_admin,
    franchisee_number,
    acn,
    address,
    postalcode,
    contact,
  } = formObj;

  if(!franchisee_name) {
    errors.franchisee_name = "Franchisee Name is required!"
  }

  if(!abn) {
    errors.abn = "provide australian business number";
  }

  if(!city) {
    errors.city = "City is required!";
  }

  if(!state) {
    errors.state = "State is required!";
  }

  if(!franchisee_admin_email) {
    errors.franchisee_admin_email = "Franchisee Admin's email is required!";
  }

  if(!franchisee_admin) {
    errors.franchisee_admin = "please select Franchisee admin";
  }

  if(!franchisee_number) {
    errors.franchisee_number = "Franchisee number is required!";
  }

  if(!acn) {
    errors.acn = "provide australian company number!";
  }

  if(!address) {
    errors.address = "Address is required!";
  }

  if(!postalcode) {
    errors.postcode = "postal code is required!";
  }

  if(postalcode.length !== 4) {
    errors.postalcodeLength = "postal code should be 4-digit long."
  }

  if(!contact) {
    errors.contact = "contact number is required!";
  }

  return errors;
}


export const UserFormValidation = (formObj) => {
  let errors = {};

  let {
    fullname,
    role,
    city,
    address,
    postalCode,
    email,
    phone,
    terminationDate,
  } = formObj;

  if(!fullname)
    errors.fullname = "Username is required!";

  if(!role)
    errors.role = "User role is required!";
  
  if(!city)
    errors.city = "City is required!";
  
  if(!address)
    errors.address = "Address is required!";

  if(!postalCode)
    errors.postalCode = "Postal code is required!";

  if(!email)
    errors.email = "Email is required!";

  if(!phone)
    errors.phone = "Phone number is required!";

  if(!terminationDate)
    errors.terminationDate = "select a termination date!";

  return errors;
};