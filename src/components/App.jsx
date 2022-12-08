import React from 'react';
import Main from './Main';

const FRONT_BASE_URL = process.env.REACT_APP_FRONT_BASE_URL;
const BASE_URL = process.env.REACT_APP_BASE_URL;
const IGNORE_REMOVE_FORM = process.env.REACT_APP_IGNORE_REMOVE_FORM;

function App() {
  return (
    <div id="main">
      <Main />
    </div>
  );
}

export default App;
export { BASE_URL, FRONT_BASE_URL, IGNORE_REMOVE_FORM };
