const Protected = ({ isLoggedIn, children }) =>  {
  return localStorage.getItem('token') ? children[1] : children[0];
}

export default Protected;