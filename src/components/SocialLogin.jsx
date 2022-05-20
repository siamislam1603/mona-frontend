import React from "react";
import { Link } from 'react-router-dom';

const SocialLogin = () => {
    return (
      <>
        <div className="custom_social_icon">
          <Link to="#" className="m-2">
            <img alt="" src="../img/Google.svg"/>
          </Link>
          <Link to="#" className="m-2">
            <img alt="" src="../img/facebook.svg"/>
          </Link>
        </div>
      </>
    );
}
export default SocialLogin;
