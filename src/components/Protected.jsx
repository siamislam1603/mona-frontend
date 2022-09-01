// import { verifyPermission } from '../helpers/roleBasedAccess';


// const Protected = ({ controller, action,  children }) =>  {

//   // useEffect(() => {
//   //   const item = localStorage.getItem('token');

//     const termission = verifyPermission(controller, action)
//     console.log("controller controllercontroller controllercontroller controller", controller)
//     console.log("action action action action action", action)

//   // }, []);


//     // window.location.href = '/educator-dashboard';

//   // return !localStorage.getItem('token') || termission === false ? children[0] : children[1] ;

//   return !localStorage.getItem('token') ? children[0] : children[1] ;


// }

// export default Protected;


const Protected = ({ isLoggedIn, children }) =>  {
  return !localStorage.getItem('token') ? children[0] : children[1] ;
}

export default Protected;