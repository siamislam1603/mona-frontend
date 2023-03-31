import { BASE_URL } from '../../../../components/App';

export const getUserTrainingsAPI = ({ userId, search }) => {
  return `${BASE_URL}/training/list/all/${userId}?search=${search}`;
};
