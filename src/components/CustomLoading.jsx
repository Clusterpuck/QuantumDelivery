// CustomLoading.js
import React from 'react';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import { styled, keyframes } from '@mui/material/styles';

// Define a keyframe animation for rotating arrows
const rotate = keyframes`
0%, 20%, 50%, 80%, 100% { transform: translateX(0); }
  40% { transform: translateX(-30px); }
  60% { transform: translateX(-15px); }
`;

// Styled container to rotate the icon
const RotatingContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  animation: `${rotate} 1s linear infinite`,
});

const CustomLoading = () => (
  <RotatingContainer>
    <AltRouteIcon fontSize="inherit" />
  </RotatingContainer>
);

export default CustomLoading;
