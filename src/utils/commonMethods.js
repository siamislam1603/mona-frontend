import moment from 'moment';

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