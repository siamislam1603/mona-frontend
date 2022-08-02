import React from 'react'
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"
import App from './components/App';
import reportWebVitals from './reportWebVitals';

import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/stylev.css';
import './assets/css/style.css';
import './assets/css/style_r.css';

const root = ReactDOM.createRoot(document.querySelector('#root'))
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,  
);

reportWebVitals();
