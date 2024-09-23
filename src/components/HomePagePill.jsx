import React from 'react';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { Grid } from '@mui/material';

const HomePagePill = ({text, amount, Icon}) => {
    const theme = useTheme();
    return (
        <Badge color="secondary"
        sx={{
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',  // Add shadow here
            borderRadius: '20px',                          // Optional: soften edges
            width: '100%',
          }}

        > 
          <Chip
            avatar={<Avatar><Icon/></Avatar>} // Icon goes here
                label={
                    <Grid container alignItems="center">
                    <Grid item xs={8} md={8}>
                        <span style={{ textAlign: 'left', width: '100%' }}>{text}</span>
                    </Grid>
                    <Grid item xs={4} container justifyContent="flex-end">
                        <span style={{ fontWeight: 'bold', textAlign: 'right', marginLeft: '4rem' }}>{amount}</span>
                    </Grid>
                </Grid>
                }
            variant="outlined" // Optional: gives an outlined look
            sx={{
                padding: '1rem',          // Increase padding for larger size
                fontSize: '1.5rem',        // Larger text size
                height: '60px',            // Adjust height for a bigger chip
                borderRadius: '25px',
                width: '100%',      
                backgroundColor: theme.palette.secondary.main, 
                color: theme.palette.text.primary,          // Text color (based on your theme)
                '& .MuiChip-avatar': {
                  width: 48,               // Larger avatar size
                  height: 48,              // Larger avatar size
                }
              }}
          />
        </Badge>
      );

}

export default HomePagePill;