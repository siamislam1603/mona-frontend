import React from 'react';
import './Popup.css';

function Popup({show, children}) {
  return show && (
    <div className="popup-bg">
      <div className="popup-container">
        { children }
      </div>
    </div>
  );
}

export default Popup;