import React from 'react';
import Main from "./Main";

<<<<<<< HEAD
const BASE_URL = "http://3.26.39.12:4000";
// const BASE_URL = "http://3.26.240.23:4000";
// const BASE_URL = "http://127.0.0.1:4000";
// const FRONT_BASE_URL = "http://localhost:5000";
const FRONT_BASE_URL = "http://3.26.240.23:5000";
=======
 const BASE_URL = "http://3.26.39.12:4000";
// const BASE_URL = "http://127.0.0.1:4000";
//const BASE_URL = "http://localhost:4000";

const FRONT_BASE_URL="http://localhost:5000";
// const FRONT_BASE_URL = "http://3.26.39.12:5000";
// const FRONT_BASE_URL = "http://3.26.240.23:5000";
>>>>>>> 0a2629edb8227e43cdf87f818d81167db7c3a653


function App() {
  return (
    <div id="main">
      <Main />
    </div>
  );
}
export default App;
export { BASE_URL, FRONT_BASE_URL };
