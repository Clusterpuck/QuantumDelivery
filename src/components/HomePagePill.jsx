import React from 'react';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { Grid, Typography } from '@mui/material';

const HomePagePill = ({ text, amount, Icon }) =>
{
  const theme = useTheme();
  return (
    <Badge 
      color="primary"
      sx={{
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',  // Add shadow here
        borderRadius: '20px',                          // Optional: soften edges
        width: '100%',
        background: theme.palette.primary.accent
      }}

    >
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item sx={{ display: 'flex', alignItems: 'center' }} margin={1}>
              <Icon sx={{color:theme.palette.primary.main}} /> 
              <Typography variant='h4' color={theme.palette.text.primary} sx={{ marginLeft: '8px' }}>
                {text}
              </Typography>
            </Grid>
            <Grid item margin={1}>
              <Typography variant='h3' color={theme.palette.primary.main}>
                {amount}
              </Typography>
            </Grid>
          </Grid>
        
    </Badge>
  );

}

export default HomePagePill;