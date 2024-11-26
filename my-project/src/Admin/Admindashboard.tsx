import { useContext, useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import { People, Event, Work, School } from '@mui/icons-material';
import axios from 'axios';
import { LoadingContext } from '../components/Contex/Loding';
import { useNavigate } from 'react-router-dom'; // Ensure you have react-router-dom installed

const AdminDashboard = () => {
  const loading = useContext(LoadingContext);
  const [data, setData] = useState({
    totalEvents: 0,
    newJobPosts: 0,
    newAlumniRegs: 0,
    totalAlumni: 0,
  });
  
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchData = async () => {
      try {
        loading?.showLoading(true);
        const eventsResponse = await axios.get('/api/events/count');
        const jobPostsResponse = await axios.get('/api/job-posts/count');
        const alumniRegsResponse = await axios.get('/api/alumni/registrations/count');
        const totalAlumniResponse = await axios.get('/api/alumni/total/count');
        
        setData({
          totalEvents: Number(eventsResponse.data.count),
          newJobPosts: Number(jobPostsResponse.data.count),
          newAlumniRegs: Number(alumniRegsResponse.data.count),
          totalAlumni: Number(totalAlumniResponse.data.count),
        });
        loading?.showLoading(false);
      } catch (error) {
        console.log('Error fetching data:', error);
        loading?.showLoading(false);
      }
    };

    fetchData();
  }, []);

  // Event handler functions
  const handleViewEvents = () => {
    navigate('/admin/events/manage events'); // Replace with the path to your events page
  };

  const handleViewJobPosts = () => {
    navigate('/admin/jobs/New Jobs'); // Replace with the path to your job posts page
  };

  const handleViewAlumniRegs = () => {
    navigate('/admin/alumni/new alumnis'); // Replace with the path to your alumni registrations page
  };

  const handleViewTotalAlumni = () => {
    navigate('/admin/alumni/manage alumnis'); // Replace with the path to your total alumni page
  };

  return (
    <div className="p-6">
      <Typography variant="h4" className="font-bold mb-6">
        Dashboard
      </Typography>
      
      <Grid container spacing={4}>
        {/* Total Events */}
        <Grid item xs={12} sm={6} md={3}>
          <Card className="shadow-lg rounded-lg bg-red-700" sx={{ background: '#ADD8E6' }}>
            <CardContent className="flex flex-col items-center justify-center">
              <Event fontSize="large" className="text-purple-500 mb-4" />
              <Typography variant="h5" className="font-bold">{data.totalEvents}</Typography>
              <Typography className="text-gray-500 mb-4">Total Events</Typography>
              <Button variant="contained" color="primary" onClick={handleViewEvents}>View Details</Button>
            </CardContent>
          </Card>
        </Grid>

        {/* New Job Post Requests */}
        <Grid item xs={12} sm={6} md={3}>
          <Card className="shadow-lg rounded-lg" sx={{ background: '#ADD8E6' }}>
            <CardContent className="flex flex-col items-center justify-center">
              <Work fontSize="large" className="text-orange-500 mb-4" />
              <Typography variant="h5" className="font-bold">{data.newJobPosts}</Typography>
              <Typography className="text-gray-500 mb-4">New Job Posts</Typography>
              <Button variant="contained" color="primary" onClick={handleViewJobPosts}>View Details</Button>
            </CardContent>
          </Card>
        </Grid>

        {/* New Alumni Registrations */}
        <Grid item xs={12} sm={6} md={3}>
          <Card className="shadow-lg rounded-lg" sx={{ background: '#ADD8E6' }}>
            <CardContent className="flex flex-col items-center justify-center">
              <People fontSize="large" className="text-yellow-500 mb-4" />
              <Typography variant="h5" className="font-bold">{data.newAlumniRegs}</Typography>
              <Typography className="text-gray-500 mb-4">New Alumni Reg</Typography>
              <Button variant="contained" color="primary" onClick={handleViewAlumniRegs}>View Details</Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Alumni */}
        <Grid item xs={12} sm={6} md={3}>
          <Card className="shadow-lg rounded-lg" sx={{ background: '#ADD8E6' }}>
            <CardContent className="flex flex-col items-center justify-center">
              <School fontSize="large" className="text-green-500 mb-4" />
              <Typography variant="h5" className="font-bold">{data.totalAlumni}</Typography>
              <Typography className="text-gray-500 mb-4">Total Alumni</Typography>
              <Button variant="contained" color="primary" onClick={handleViewTotalAlumni}>View Details</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default AdminDashboard;
