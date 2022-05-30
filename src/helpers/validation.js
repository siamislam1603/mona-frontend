export const DynamicFormValidation = (form,data) => {
  let newErrors = {};
  data.map((item)=>{
    console.log("item.required",item.required);
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
export const createFormFieldValidation=(form)=>{
  let newErrors=[{}];
  console.log("field label---->",form[0]?.field_label);
  for(let i=0;i<form.length;i++)
  {
    if(!newErrors[i])
    {
      newErrors[i]={};
    }
    let {field_label,field_type,option}=form[i];
    console.log("field label-xdbvgfdsds--->",field_label);
    if(!field_label || field_label==="")
    {
      newErrors[i].field_label="Field Label is Required";
    }
    if(!(field_type==="text"))
    {
      for(let j=0;j<option.length;j++)
      {
        console.log("Object.keys(option[j])---->",Object.keys(option[j])[0]);
        if(Object.keys(option[j])[0]==="")
        {
          if(!newErrors[i].option)
          {
            newErrors[i].option=[];
          }
          newErrors[i].option.push(`Option ${j+1} is Required`);
        }
        else
        {
          if(!newErrors[i].option)
          {
            newErrors[i].option=[];
          }
          newErrors[i].option.push(``);
        }
      }
    }
    console.log("new Errors----->",newErrors);
  }
  
  return newErrors;

}
export const createFormValidation=(form)=>{
  let newErrors={};
  let {form_name,form_type,form_description,form_template_select,previous_form}=form;
  if (!form_name || form_name==="") newErrors.form_name="Form Title is Required";
  if (!form_type || form_type==="") newErrors.form_type="Form Type is Required";
  if (!form_description || form_description==="") newErrors.form_description="Form Description is Required";
  if(form_template_select==="Yes") if (!previous_form || previous_form==="") newErrors.previous_form="Previous Form is Required";
  return newErrors;
}
export const createOperatingManualValidation=(form)=>{
  let newErrors={};
  let {question,answer,category}=form;
  if (!question || question==="") newErrors.question="Question is Required";
  if (!answer || answer==="") newErrors.answer="Answer is Required";
  if (!category || category==="") newErrors.category="Category is Required";
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
