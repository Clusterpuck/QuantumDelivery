import React from 'react';
import MinorCrashIcon from '@mui/icons-material/MinorCrash';
import { Box, Typography } from '@mui/material';
import { LineWeight } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const NoRouteFound = () => {
    const theme = useTheme();
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                width: '100%',
                textAlign: 'center',
                p: 2
            }}
        >
            <MinorCrashIcon sx={{ fontSize: 100, color: theme.palette.primary.darkaccent, fontWeight:'bold' }} />
            <Typography variant="h6" color="textSecondary" sx={{ mt: 2 } }>
                No routes to display.
            </Typography>
        </Box>
    );
};

export default NoRouteFound;