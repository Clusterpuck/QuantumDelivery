import React from 'react';
import { Link } from 'react-router-dom';

// Page design for view routes page
const ViewRoutes = () => {
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
        <h1>View Routes</h1>
        <a href="/">Back Home</a>
    </div>
);
};

export default ViewRoutes;
