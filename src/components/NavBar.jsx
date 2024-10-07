import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Cookies from 'js-cookie';
import { useTheme } from '@mui/material/styles';

// Define the pages for admin and driver
const admin_pages = [
  { name: 'Routes', path: '/viewroutes' },
  { name: 'Orders', path: '/orders' },
  { name: 'Live Tracking', path: '/livetracking' },
  //{ name: 'Daily Reports', path: '/dailyreports' },
  { name: 'Driver Navigation', path: '/admindrivernav'},
  { name: 'Admin Controls', path: '/admincontrols'}
];

const driver_pages = [
  { name: 'View Routes', path: '/driverviewroutes'}
];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const authToken = Cookies.get('authToken');
  const authRole = Cookies.get('userRole');
  const theme = useTheme();

  // Determine pages based on role
  const pages = authRole === 'ADMIN' ? admin_pages : authRole === 'DRIVER' ? driver_pages : [];
  const home_path = authRole === 'ADMIN' ? '/home' : authRole === 'DRIVER' ? '/driverviewroutes' : '/login'; // Default to login if no role

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogout = () => {
    Cookies.remove('authToken');
    Cookies.remove('userRole');
    navigate('/login');
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: theme.palette.primary.lightaccent, color: theme.palette.text.primary }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo image only visible on medium and larger screens */}
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <img 
              src="/quantalogo.png" 
              alt="Company Logo" 
              style={{ height: 40 }} 
            />
          </Box>

          <Typography
            variant="h6"
            noWrap
            component={Link}
            to={home_path}
            sx={{
              mr: 4,
              ml: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            QuantaPath
          </Typography>

          {authToken && (
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {/**Drop down menu options */}
                {pages.map((page) => (
                  <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                    <Typography
                      textAlign="center"
                      component={Link}
                      to={page.path}
                      sx={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {page.name}
                    </Typography>
                  </MenuItem>
                ))}
                {/* Logout option for mobile view */}
                <MenuItem onClick={handleLogout}>
                <Typography
                  textAlign="center"
                  sx={{ fontSize: 'inherit', textDecoration: 'none', color: 'inherit' }}
                >
                  Logout
              </Typography>
                </MenuItem>
              </Menu>
            </Box>
          )}

          <Typography
            variant="h6"
            noWrap
            component={Link}
            to={home_path}
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            QuantaPath
          </Typography>

          {authToken && (
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  component={Link}
                  to={page.path}
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: location.pathname === page.path ? theme.palette.primary.darkaccent : theme.palette.text.primary, // Highlight current page
                    display: 'block',
                    textDecoration: location.pathname === page.path ? 'underline' : 'none', // Underline when selected
                    fontWeight: location.pathname === page.path ? 'bold' : 'normal', // Bold when selected
                }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {authToken && (
              <>
                <IconButton
                  component={Link}
                  to="/accountdetails"
                  sx={{ color: 'inherit', ml: 2, fontSize: 32 }}
                >
                  <AccountCircleIcon fontSize="inherit" />
                </IconButton>
                {/* Logout option for larger screens */}
                <Button 
                  onClick={handleLogout} 
                  sx={{ color: 'inherit', ml: 2, display: { xs: 'none', md: 'inline-flex' } }}
                >
                  Logout
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>

  );
}

export default Navbar;
