import { verifyPermission } from '../helpers/roleBasedAccess';


const Protected = ({ controller, action,  children }) =>  {

  // useEffect(() => {
  //   const item = localStorage.getItem('token');

  // console.log("controller controllercontroller controllercontroller controller", controller)
  // console.log("action action action action action", action)

  const isLoggedIn = localStorage.getItem('token');
    if(isLoggedIn === 'undefined' || !isLoggedIn ){
      return children[0];
    }

    if(controller && action){
    const permission = verifyPermission(controller, action)
    // console.log("permission permission permission", permission)
    

    if(permission == true)
    {
      return children[1] ;
    }else{

      localStorage.setItem('success_msg','You have no permission to access this page')
      window.location.href = '/';
    }

  }else{
    return children[1] ;

  }
    // window.location.href = '/educator-dashboard';

  // return !localStorage.getItem('token') || termission === false ? children[0] : children[1] ;



}

export default Protected;


// const Protected = ({ isLoggedIn, children }) =>  {
//   return !localStorage.getItem('token') ? children[0] : children[1] ;
// }

// export default Protected;