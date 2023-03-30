import { BASE_URL } from '../../../../components/App';

export const getUserTrainingsAPI = ({ userId, userRole }) => {
  return `${BASE_URL}/training/list/all/${userId}?role=${userRole}`;
};
