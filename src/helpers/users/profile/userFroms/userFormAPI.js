import { BASE_URL } from '../../../../components/App';

export const getUserFormsAPI = ({ userId, userRole, search }) => {
  let role = userRole.trim() === 'guardian' ? 'guardian,child' : userRole;
  return `${BASE_URL}/form/form-list/user/${userId}?userRole=${role}&search=${search}`;
};