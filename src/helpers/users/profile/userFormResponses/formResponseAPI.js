import { BASE_URL } from '../../../../components/App';

export const getFormResponseAPI = ({ formId, search }) => {
  console.log('search:', search);
  return `${BASE_URL}/form/form-response/user/${formId}?search=${search}`;
};
