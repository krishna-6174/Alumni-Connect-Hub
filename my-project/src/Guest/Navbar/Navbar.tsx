import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink, useLocation } from 'react-router-dom';

const links = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Events', path: '/events' },
  { name: 'Register', path: '/register' },
  { name: 'Contact Us', path: '/contact' },
  { name: 'Login', path: '/login' },
];

const Navbar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  // Helper function for checking active link
  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#3F51B5' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ color: 'white' }}>
            Alumni Connect Hub
          </Typography>
          <div className="hidden lg:flex space-x-4">
            {links.map((link) => (
              <Button
                key={link.name}
                component={NavLink}
                to={link.path}
                sx={{ color: isActive(link.path) ? 'yellow' : 'white' }}
              >
                {link.name}
              </Button>
            ))}
          </div>
          <div className='lg:hidden'>
          <IconButton color="inherit" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          </div>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer} sx={{
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: 260,
          backgroundColor: "#1E293B",
          color: "white",
        },
      }} >
        <List >
          <Typography variant="h5" sx={{ padding: '16px'}}>
            Navigation
          </Typography>
          <Divider sx={{ backgroundColor: 'white' }} />
          {links.map((link) => (
            <ListItem
              key={link.name}
              button
              component={NavLink}
              to={link.path}
              onClick={toggleDrawer}
              sx={{ background: isActive(link.path) ? "#334155" : "transparent",
                color: isActive(link.path) ? "orange" : "#d1d5db" ,
                '&:hover':{backgroundColor: "#334155"}
               }}
            >
              <ListItemText primary={link.name} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
