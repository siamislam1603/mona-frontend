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
// const BASE_URL ='http://54.206.190.120:4000'
const FRONT_BASE_URL = "http://localhost:5000";
>>>>>>> b08a6ac4673c64c2c6acc6847e4f31af56a5a1f1
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
