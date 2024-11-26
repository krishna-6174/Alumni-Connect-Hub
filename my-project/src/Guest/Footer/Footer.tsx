// // Footer.tsx
// import React from "react";
// import { Link } from "react-router-dom";

// const Footer: React.FC = () => {
//   return (
//     <footer>
//       <Link to="/admin-login">Admin Login</Link>
//     </footer>
//   );
// };

// export default Footer;
import React from 'react';
import { Container, Grid, Typography, Link, Divider } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import LocalPostOfficeRoundedIcon from '@mui/icons-material/LocalPostOfficeRounded';
import EastIcon from '@mui/icons-material/East';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
const Footer: React.FC = () => {
  return (
    <footer className=" bg-gray-900 text-white pt-10">
      <Container maxWidth="lg" className='pb-7'>
        <Grid container spacing={4}>
          {/* Get in Touch Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" className="font-bold mb-1">
              Get in Touch
            </Typography>
            <Divider className="mb-4  w-full" sx={{ borderColor: 'white',borderWidth: '1px' }} />
            <Typography variant="body2" className="m-2">
              <LocationOnRoundedIcon/>GCET College, Hyderabad
            </Typography>
            <Typography variant="body2" className="m-2">
            <LocalPostOfficeRoundedIcon/>abc@gmail.com
            </Typography>
            <Typography variant="body2" className="m-2">
              <CallRoundedIcon/>+91 XXXXXXXXXXX
            </Typography>
            <div className="flex space-x-4 mt-4">
            <Link href="#" ><FacebookIcon sx={{ color: 'white',fontSize: 40 }} /></Link>
              <Link href="#"><TwitterIcon sx={{ color: 'white',fontSize: 40 }} /></Link>
              <Link href="#"><InstagramIcon sx={{ color: 'white',fontSize: 40 }}/></Link>
              <Link href="#" ><YouTubeIcon sx={{ color: 'white',fontSize: 40 }} /></Link>
            </div>
          </Grid>

          {/* About Alumni Tracking Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" className="font-bold mb-1">
              About Alumni Tracking
            </Typography>
            <Divider className="mb-2  w-full" sx={{ borderColor: 'white',borderWidth: '1px' }} />
            <Typography variant="body1" className="">
              The proposed system will be online so it can be accessed by alumni anywhere. 
              It will enable quick and easy communication. Each user will be responsible 
              for updating their own information. Each user will also have the option to 
              maintain their privacy.
            </Typography>
          </Grid>

          {/* Quick Menu Section */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" className="font-bold mb-1">
              Quick Menu
            </Typography>
            <Divider className="mb-2  w-full" sx={{ borderColor: 'white',borderWidth: '1px' }} />
            <ul className="space-y-2">
              <li>
              <Link
      href="/"
      style={{ textDecoration: 'none' }}
    >
      <span className="flex text-white items-center space-x-1 transform transition-all duration-300 hover:translate-x-3 hover:text-blue-800">
        <EastIcon/>
        <span>Home</span>
      </span>
    </Link>
              </li>
              <li>
              <Link
      href="/about"
      style={{ textDecoration: 'none' }}
    >
       <span className="flex text-white items-center space-x-1 transform transition-all duration-300 hover:translate-x-3 hover:text-blue-800">
        <EastIcon />
        <span>About Us</span>
      </span>
    </Link>
              </li>
              <li>
              <Link
      href="/events"
      style={{ textDecoration: 'none' }}
    >
       <span className="flex text-white items-center space-x-1 transform transition-all duration-300 hover:translate-x-3 hover:text-blue-800">
        <EastIcon  />
        <span >Events</span>
      </span>
    </Link>
              </li>
              <li>
              <Link
      href="/gallery"
      style={{ textDecoration: 'none' }}
    >
       <span className="flex text-white items-center space-x-1 transform transition-all duration-300 hover:translate-x-3 hover:text-blue-800">
        <EastIcon />
        <span >Gallery</span>
      </span>
    </Link>
              </li>
              <li>
              <Link
      href="/contact"
      style={{ textDecoration: 'none' }}
    >
       <span className="flex text-white items-center space-x-1 transform transition-all duration-300 hover:translate-x-3 hover:text-blue-800">
        <EastIcon />
        <span>Contact Us</span>
      </span>
    </Link>
              </li>
            </ul>
          </Grid>
        </Grid>
        </Container>
        <Divider className="w-full" sx={{ borderColor: 'black',borderWidth: '1px'}} />
        <div className='flex justify-center items-center bg-gray-900 p-2'>
        <div className="flex space-x-4">
            <Link href="/login" className="text-white hover:text-indigo-900" style={{ textDecoration: 'none' }}>
              Alumni Login
            </Link>
            <span className='px-2'>|</span>
            <Link href="/register" className="text-white hover:text-indigo-900" style={{ textDecoration: 'none' }}>
              Alumni Register
            </Link><span className='px-2'>|</span>
            <Link href="/adminlogin" className="text-white hover:text-indigo-900" style={{ textDecoration: 'none' }}>
              Admin Login
            </Link>
        </div></div>
        <div className="flex justify-center items-center bg-black p-2">
        
          <Typography variant="body2" className="text-white">
            &copy;2024 Alumni Association of the College of GCET
          </Typography>
        </div>
      
    </footer>
  );
};

export default Footer;
