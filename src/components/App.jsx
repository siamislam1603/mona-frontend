import React from 'react';
import Main from "./Main";

const BASE_URL = "http://3.26.39.12:4000";
// const BASE_URL = "http://3.26.240.23:4000";
// const BASE_URL = "http://127.0.0.1:4000";
// const BASE_URL = "http://localhost:4000";
// const BASE_URL = "https://bad0-2409-4040-404-8a6a-5c48-ecf5-3de4-1d74.in.ngrok.io";

function App() {
  return (
    <div id="main">
      <Main />
    </div>
  );
}
export default App;
export { BASE_URL,FRONT_BASE_URL };
