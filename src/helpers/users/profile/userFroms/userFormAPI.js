import { BASE_URL } from '../../../../components/App';

export const getUserFormsAPI = ({ userId, userRole }) => {
  let role = userRole.trim() === 'guardian' ? 'child' : userRole;
  return `${BASE_URL}/form/form-list/user/${userId}?userRole=${role}`;
};
