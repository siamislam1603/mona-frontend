const Protected = ({ isLoggedIn, children }) =>  {
  return !localStorage.getItem('token') ? children[0] : children[1] ;
}

export default Protected;