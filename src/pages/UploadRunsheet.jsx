
import React, {useEffect} from 'react';
import {enableScroll} from '../assets/scroll.js';

// Page design for upload runsheets page
const UploadRunsheet = () => {
  useEffect(() => {
    enableScroll();
}, []);

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
        }}
      >
        <h1>Upload Runsheet</h1>
      </div>
    );
};

export default UploadRunsheet;
