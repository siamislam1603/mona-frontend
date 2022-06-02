import React from 'react';
import Main from "./Main";

const BASE_URL="http://3.26.39.12:4000";
// const BASE_URL="http://localhost:4000";
const API_BASE_URL="http://127.0.0.1:4000";

function App() {
  return (
    <div id="main">
      <Main />
    </div>
  );
}

export default App;
export { BASE_URL,API_BASE_URL};
