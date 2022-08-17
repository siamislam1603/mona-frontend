export const DynamicFormValidation = (form, data, behalf_of) => {
  let newErrors = {};
  Object.keys(data)?.map((item) => {




    // console.log('inner_item_item--->', item);
    data[item].map((inner_item) => {
      // console.log('inner_item', form[item]);

      if (inner_item.required) {
        console.log('inner_item', inner_item);
        console.log("form-=-->21321313", form);
        if (!form[item][`${inner_item.field_name}`]) {
          newErrors[
            `${inner_item.field_name}`
          ] = `${inner_item.field_label} is required`;
        }
      }
    });
  });
  if (!behalf_of || behalf_of === '')
    newErrors.behalf_of = 'Behalf of is required';

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
export const createOperatingManualValidation = (form) => {
  let newErrors = {};
  let { title, description, order } = form;
  if (!title || title === '') newErrors.title = 'Title is Required';
  if (!description || description === '')
    newErrors.description = 'Description is Required';
  if (order < 0) newErrors.order = 'Value must be greater than 0';
  if (order === 0 || order === '0')
    newErrors.order = 'Value must be greater than 0';
  if (!order || order === '') newErrors.order = 'Position is Required';

  return newErrors;
};
//Validation for edit annoutment

export const AddNewAnnouncementValidation = (form, coverImage) => {
  console.log('The form validation', form);
  let newErrors = {};
  console.log('The form validat', form);
  let { title, meta_description, start_date, start_time } = form;
  console.log('The tile valdiation', start_date);
  if (!title || title === ' ')
    newErrors.title = 'Announcement Title is Required';
  // if (!coverImage)newErrors.coverImage = 'Cover image is Required';
  if (!start_date || start_date === 'undefined')
    newErrors.start_date = 'Start Date Required';
  if (!start_time || start_time === 'undefined')
    newErrors.start_time = 'Start Time Required';
  if (!meta_description || meta_description === ' ')
    newErrors.meta_description = 'Announcement Description is Required';

  return newErrors;
};
export const EditAnnouncementValidation = (form, coverImage, Data) => {
  let newErrors = {};
  console.log('The form validat', form);
  // console.log("The DATA VALIDATION",newData)
  let { title, meta_description, start_date, start_time } = form;

  console.log('All valiatiion', title, start_date, meta_description);
  if (!title || title === ' ') newErrors.title = 'Title is Required';
  // if (!coverImage || coverImage === '')newErrors.coverImage = 'Cover image is Required';
  if (!meta_description || meta_description === ' ')
    newErrors.meta_description = 'Description is Required';
  if ((start_date === ' ' && !start_date) || start_date === ' ')
    newErrors.start_date = 'Start Date Required';
  if ((start_time === ' ' && !start_time) || start_time === ' ')
    newErrors.start_time = 'Start Time Required';
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

  if (title <= 2) {
    errors.title_length = 'Training title should be more than 2 characters.';
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

  if (Object.keys(coverImage).length === 0) {
    errors.coverImage = 'Cover image required!';
  }
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
  let {
    id,
    title,
    description,
    categoryId,
    assigned_users,
    assigned_roles,
  } = form;

  if (!title) {
    errors.title = ' title is required!';
  }

// >>>>>>> master
  if (title <= 2) {
    errors.title_length = ' title should be more than 2 characters.';
  }

  if (!description) {
    errors.description = 'Training description is required!';
  }

  if (!categoryId) {
    errors.categoryId = 'categoryid  is required!';
  }

  if (!assigned_users) {
    errors.assigned_users = 'assigned_user time is required!';
  }

  if (!assigned_roles) {
    errors.assigned_roles = 'user_roles time is required!';
  }

  if (Object.keys(coverImage).length === 0) {
    errors.coverImage = 'Cover image required!';
  }
  return errors;
};

export const PasswordValidation = (form) => {
  let errors = {};
  let { oldpassword, new_password, confirm_password } = form;

  if (!oldpassword) {
    errors.oldpassword = 'Old password is required!';
  }
  if (!new_password) {
    errors.new_password = 'New Password is required';
  }
  if (new_password && new_password.length < 5) {
    errors.new_password = 'Minimum length 5';
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
  let { new_password, confirm_password } = form;
  if (!new_password) {
    errors.new_password = 'New password require';
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
    errors.franchisee_name = 'Franchisee Name is required!';
  }

  if (!abn) {
    errors.abn = 'provide australian business number';
  }

  if (!city) {
    errors.city = 'City is required!';
  }

  if (!state) {
    errors.state = 'State is required!';
  }

  if (!franchisee_number) {
    errors.franchisee_number = 'Franchisee number is required!';
  }

  if (!acn) {
    errors.acn = 'provide australian company number!';
  }

  if (!address) {
    errors.address = 'Address is required!';
  }

  if (!postcode) {
    errors.postcode = 'postal code is required!';
  }

  if (!contact) {
    errors.contact = 'contact number is required!';
  }

  return errors;
};

export const UserFormValidation = (formObj) => {
  let errors = {};

  let { fullname, role, city, address, postalCode, email, phone, franchisee } =
    formObj;

  if (!fullname) errors.fullname = 'Username is required!';

  if (!franchisee) errors.franchisee = 'Franchisee is required!';

  if (!role) errors.role = 'User role is required!';

  if (!city) errors.city = 'City is required!';

  if (!address) errors.address = 'Address is required!';

  if (!postalCode) errors.postalCode = 'Postal code is required!';

  if (postalCode.length !== 4)
    errors.postalCodeLength = 'Postal code should be 4-digit long!';

  if (!email) errors.email = 'Email is required!';

  if (!phone) errors.phone = 'Phone number is required!';

  return errors;
};

export const personValidation = (personValidationForm) => {
  let errors = {};
  let { name, address, telephone, relationship_to_the_child } =
    personValidationForm;

  if (!name) errors.name = 'Name is required!';

  if (!address) errors.address = 'Address is required!';

  if (!telephone) errors.telephone = 'Telephone number is required!';

  if (!relationship_to_the_child)
    errors.relationship_to_the_child =
      'Specify their relationship to the child!';

  return errors;
};

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

  if (!sleep_time) errors.sleep_time = 'sleep time is required!';

  if (!bottle_time) errors.bottle_time = 'bottle time is required!';

  if (!toileting) errors.toileting = 'toilet time is required!';

  if (!routines) errors.routines = 'routine is required!';

  if (!likes_dislikes) errors.likes_dislikes = 'specify the likes or dislikes!';

  if (!comforter) errors.comforter = 'comforter is required!';

  if (!religion) errors.religion = 'religion is reuqired!';

  if (!dietary_requirement)
    errors.dietary_requirement = 'specify the dietary requirements!';

  if (!allergy) errors.allergy = 'mention the alergies, if any!';

  if (!comment) errors.comment = 'provide a comment!';

  return errors;
};
