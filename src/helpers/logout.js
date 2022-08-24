export const logoutUser = () => {
  window.localStorage.clear();
  window.location.reload();
};