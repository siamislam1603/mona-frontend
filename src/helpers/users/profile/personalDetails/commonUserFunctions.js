import { getLoggedInUserRole } from '../../../../utils/commonMethods';

export const isUserNoteAvailable = (note) => {
  return note?.length === 0 || note === 'null' || note === null ? false : true;
};

export const canViewUserNote = () => {
  let role = getLoggedInUserRole();

  return (
    role === 'franchisor_admin' ||
    role === 'franchisee_admin' ||
    role === 'coordinator'
  );
};

export const populateUserRole = (roleData, currentUserRole) => {
  let data = roleData.filter((d) => d.value === currentUserRole) || '';
  return data[0]?.label;
};

export const populateUserPhone = (telcode, phone) => {
  let phoneStr = telcode && phone ? `${telcode}-${phone}` : '';

  return phoneStr;
};

export const populateUserFranchise = (franchiseList, franchiseId) => {
  let dataStr = franchiseList?.filter(
    (item) => parseInt(item.id) === parseInt(franchiseId)
  );

  return dataStr ? dataStr[0]?.label : '';
};

export const populateUserPDC = (data, categories) => {
  let dataStr = data?.filter((d) => categories?.includes(parseInt(d.id)));
  dataStr = dataStr.map((item) => item.label);

  return dataStr ? dataStr.join(', ') : '';
};

export const populateUserTrainingCategoryData = (data, categories) => {
  let dataStr = data?.filter((d) => categories?.includes(parseInt(d.id)));

  dataStr = dataStr.map((item) => item.label);

  return dataStr ? dataStr.join(', ') : '';
};

export const populateUserBusinessAssets = (data, assets) => {
  let dataStr = data?.filter((d) => assets?.includes(parseInt(d.id)));

  dataStr = dataStr.map((item) => item.label);

  return dataStr ? dataStr.join(', ') : '';
};

export const populateCoordinator = (data, coordinator) => {
  let dataStr = data.filter(
    (item) => parseInt(item.id) === parseInt(coordinator)
  );

  return dataStr && dataStr.length > 0 ? dataStr[0]?.label : '';
};
