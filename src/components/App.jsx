import React from 'react';
import Main from "./Main";

<<<<<<< HEAD
const BASE_URL = "http://13.237.14.155:4000";
// const BASE_URL = "http://13.237.14.155:4000";
// const FRONT_BASE_URL = "http://13.237.14.155:5000";
// const BASE_URL = "http://localhost:4000";
const FRONT_BASE_URL = "http://13.237.14.155:5000";
=======
// const BASE_URL = "http://localhost:4000";
const BASE_URL = 'http://13.237.14.155:4000'
const FRONT_BASE_URL = "http://localhost:5000";
>>>>>>> b267562881a0c92a232aa3060c5cc6b04c78353d
const IGNORE_REMOVE_FORM = "Compliance Visit Form";

function App() {
  return (
    <div id="main">
      <Main />
    </div>
  );
}

export default App;
export { BASE_URL, FRONT_BASE_URL, IGNORE_REMOVE_FORM };
