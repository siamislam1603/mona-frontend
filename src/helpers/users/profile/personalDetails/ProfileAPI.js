import { BASE_URL } from '../../../../components/App';

export const getCommonUserDataAPI = () => {
  let API_ARRAY = [
    `${BASE_URL}/api/user-role`,
    `${BASE_URL}/training/get-training-categories`,
    `${BASE_URL}/api/get-pdc`,
    `${BASE_URL}/api/get-business-assets`,
    `${BASE_URL}/role/franchisee`,
  ];

  return API_ARRAY;
};

export const getUserCoordinatorAPI = (userFranchiseId) => {
  return `${BASE_URL}/role/franchisee/coordinator/franchiseeID/${userFranchiseId}/coordinator`;
};
export const getUserDetailAPI = (userId) => {
  return `${BASE_URL}/auth/user/info/${userId}`;
};
