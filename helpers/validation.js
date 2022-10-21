export const DynamicFormValidation = (form,data) => {
    let newErrors = {};
    data.map((item)=>{
      if(item.required)
      {
        if(!form[`${item.field_name}`])
        {
          newErrors[`${item.field_name}`]=`${item.field_label} is required`; 
        }
      }
      
    });
    return newErrors;
  };
  export const createOperatingManualValidation=(form)=>{
    let newErrors={};
    let {question,answer,category}=form;
    if (!question || question==="") newErrors.question="Question is Required";
    if (!answer || answer==="") newErrors.answer="Answer is Required";
    if (!category || category==="") newErrors.category="Category is Required";
    return newErrors;
  }
  export const createFormValidation = (form) => {
    let newErrors = {};
    let { field_name, field_type, field_label, choices, order, required } = form;
    if (!field_name) newErrors.field_name = "Field Name is Required";
    if (!field_type) newErrors.field_type = "Field Type is Required";
    if (!field_label) newErrors.field_label = "Field label is Required";
    if (
      field_type === "radio" ||
      field_type === "checkbox" ||
      field_type === "select"
    ) {
      if (!choices) newErrors.choices = "Choices are Required";
    }
    if (!order) newErrors.order = "order is required";
    if (!required) newErrors.required = "Required Field is required";
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
      newErrors.child_name = "Child name is required";
    }
    if (!family_name) {
      newErrors.family_name = "Family name is required";
    }
    if (!given_name) {
      newErrors.given_name = "Given name is required";
    }
    if (!usually_called) {
      newErrors.usually_called = "Usually called is required";
    }
    if (!dob) {
      newErrors.dob = "Date of Birth is required";
    }
    if (!country_of_birth) {
      newErrors.country_of_birth = "Country of Birth is required";
    }
    if (!home_address) {
      newErrors.home_address = "Home Address is required";
    }
    if (!languages_spoken_in_home) {
      newErrors.languages_spoken_in_home = "Language spoken in home is required";
    }
    return newErrors;
  };
  