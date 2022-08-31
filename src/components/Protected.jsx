// import { verifyPermission } from '../helpers/roleBasedAccess';


// const Protected = ({ controller, action,  children }) =>  {

//   // useEffect(() => {
//   //   const item = localStorage.getItem('token');

//     const termission = verifyPermission(controller, action)
//     console.log("isLoggedInisLoggedInisLoggedInisLoggedInisLoggedInisLoggedInisLoggedIn", controller)
//     console.log("isLoggedInisLoggedInisLoggedInisLoggedInisLoggedInisLoggedInisLoggedIn", action)

//   // }, []);


//     // window.location.href = '/educator-dashboard';

//   return !localStorage.getItem('token') || termission === false ? children[0] : children[1] ;

// }

// export default Protected;


const Protected = ({ isLoggedIn, children }) =>  {
  return !localStorage.getItem('token') ? children[0] : children[1] ;
}

export default Protected;