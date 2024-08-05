import React from 'react';

const TestPage = () => {
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

export default TestPage;
