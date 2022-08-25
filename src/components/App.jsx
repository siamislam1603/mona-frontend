import React from 'react';
import Main from "./Main";

<<<<<<< HEAD

 const BASE_URL = "http://13.237.14.155:4000";
// const BASE_URL = "http://127.0.0.1:4000";
// const FRONT_BASE_URL = "http://3.26.39.12:5000";
=======
//  const BASE_URL = "http://13.237.14.155:4000";
const BASE_URL = "http://127.0.0.1:4000";
>>>>>>> 1d9bdacea67cfc649ddb5184e8060031b134c534
// const BASE_URL = "http://127.0.0.1:4000";
const FRONT_BASE_URL = "http://localhost:5000";

function App() {
  return (
    <div id="main">
      <Main />
    </div>
  );
}

export default App;
export { BASE_URL, FRONT_BASE_URL };
