import React from 'react';
import MinorCrashIcon from '@mui/icons-material/MinorCrash';
import { Box, Typography } from '@mui/material';
import { LineWeight } from '@mui/icons-material';

const NoRouteFound = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                width: '100vw',
                textAlign: 'center',
                p: 2
            }}
        >
            <MinorCrashIcon sx={{ fontSize: 100, color: '#582c4d', fontWeight:'bold' }} />
            <Typography variant="h6" color="textSecondary" sx={{ mt: 2 } }>
                No routes to display.
            </Typography>
        </Box>
    );
};

export default NoRouteFound;