import moment from 'moment';
import { BASE_URL } from '../components/App';

export const getAuthToken = () => {
  let token = localStorage.getItem('token');

  return token;
};

export const getLoggedInUserRole = () => {
  let role = localStorage.getItem('user_role');
  return role;
};

export const getLoggedInUserId = () => {
  let id = localStorage.getItem('user_id');
  return id;
};

export const isUserAllowed = (userRole, roleArray) => {
  return roleArray.includes(userRole);
};

export const isTrainingAddedByLoggedInUser = (trainingUserId) => {
  return parseInt(trainingUserId) === parseInt(getLoggedInUserId());
};

export const isEndDateAvailable = (trainingObj) => {
  let { end_date, end_time } = trainingObj;

  return end_date && end_time;
};

export const isEndDateExceeded = (trainingObj) => {
  let { end_date, end_time } = trainingObj;

  let currentTimeStamp = moment();
  let currentDate = moment(currentTimeStamp).format('YYYY-MM-DD');
  let currentTime = moment(currentTimeStamp).format('HH:mm');

  return currentDate >= end_date && currentTime > end_time;
};

export const getUserAPIs = () => {
  let API_ARRAY = [
    `${BASE_URL}/api/user-role`,
    `${BASE_URL}/training/get-training-categories`,
    `${BASE_URL}/api/get-pdc`,
    `${BASE_URL}/api/get-business-assets`,
    `${BASE_URL}/role/franchisee`,
  ];

  return API_ARRAY;
};
