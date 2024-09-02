import React from 'react';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
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
                height: '100%',
                textAlign: 'center',
                p: 2
            }}
        >
            <SentimentVeryDissatisfiedIcon sx={{ fontSize: 100, color: '#582c4d', fontWeight:'bold' }} />
            <Typography variant="h6" color="textSecondary" sx={{ mt: 2 } }>
                Sorry, there was no route found.
            </Typography>
        </Box>
    );
};

export default NoRouteFound;