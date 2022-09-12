import React from 'react';
import Main from "./Main";

const BASE_URL = "http://127.0.0.1:4000";
// const BASE_URL = "http://54.206.190.120:4000";
<<<<<<< HEAD
const BASE_URL = "http://13.237.14.155:4000";
const FRONT_BASE_URL = "http://13.237.14.155:5000";
// const FRONT_BASE_URL = "http://localhost:5000";
=======
// const BASE_URL = "http://13.237.14.155:4000";
const FRONT_BASE_URL = "http://localhost:5000";
>>>>>>> 5269e7f311e64b9baa365fa5233a3f2059488df7
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
