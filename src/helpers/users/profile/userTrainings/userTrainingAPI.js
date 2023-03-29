import { BASE_URL } from '../../../../components/App';

export const getUserTrainingsAPI = (userId) => {
  return `${BASE_URL}/training/list/all/${userId}`;
};
