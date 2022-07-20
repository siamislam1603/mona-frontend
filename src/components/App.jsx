import React from 'react';
import Main from "./Main";

//  const BASE_URL="http://3.26.39.12:4000";
<<<<<<< HEAD
//const BASE_URL="http://127.0.0.1:4000";
const BASE_URL = "http://localhost:4000";
=======
const BASE_URL="http://127.0.0.1:4000";
// const BASE_URL = "http://localhost:4000";
>>>>>>> 76a5fdbe5b9d9f0f7fa3343a4d7306160829e90d

function App() {
  return (
    <div id="main">
      <Main />
    </div>
  );
}

export default App;
export { BASE_URL };
