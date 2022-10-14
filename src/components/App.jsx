import React from 'react';
import Main from './Main';

<<<<<<< HEAD
const BASE_URL = "http://54.206.190.120:4000";
// const BASE_URL = "http://54.206.190.120:4000";
// const BASE_URL = "http://localhost:4000";
=======
// const BASE_URL = 'http://13.237.14.155:4000';
const BASE_URL = "http://54.206.190.120:4000";
// const BASE_URL = 'http://localhost:4000';
>>>>>>> e9aedfc41b3cd6a0d86734c421d9267cbea6d161
const FRONT_BASE_URL = 'http://localhost:5000';
const IGNORE_REMOVE_FORM = 'Compliance Visit Form';

function App() {
  return (
    <div id="main">
      <Main />
    </div>
  );
}

export default App;
export { BASE_URL, FRONT_BASE_URL, IGNORE_REMOVE_FORM };
