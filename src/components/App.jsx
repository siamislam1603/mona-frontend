import React from 'react';
import Main from "./Main";

<<<<<<< HEAD

const BASE_URL = "http://3.26.39.12:4000";
// const BASE_URL = "http://3.26.240.23:4000";
=======
//  const BASE_URL = "http://3.26.39.12:4000";
// const BASE_URL = "http://3.26.240.23:4000";
const BASE_URL = "http://127.0.0.1:4000";
>>>>>>> 8ac0a5b6020d5e0c87184c31a6b10bfe5ec21db0
// const BASE_URL = "http://localhost:4000";

function App() {
  return (
    <div id="main">
      <Main />
    </div>
  );
}
export default App;
export { BASE_URL };
