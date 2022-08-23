const Protected = ({ isLoggedIn, children }) =>  {
  return localStorage.getItem('is_user_logged_in') === 'logged_out' || typeof isLoggedIn === 'undefined' || isLoggedIn === false ? children[0] : children[1];
}

export default Protected;