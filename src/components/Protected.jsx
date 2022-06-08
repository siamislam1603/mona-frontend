const Protected = ({ isLoggedIn, children }) =>  {
  return typeof isLoggedIn === "undefined" || isLoggedIn === false ? children[0] : children[1];
}

export default Protected;