import React from 'react';
import { Link } from 'react-router-dom';

// Page design for upload runsheets page
const AddOrder = () => {
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
        <h1>Add Order</h1>
        <a href="/">Back Home</a>
    </div>
);
};

export default AddOrder;
