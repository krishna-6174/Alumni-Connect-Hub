import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box, Container } from '@mui/material';
import { Delete, Description, Visibility } from '@mui/icons-material';
import { ApproveDialogContext } from '../components/Contex/ApproveDialogProvider'; // Update import path accordingly
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { LoadingContext } from '../components/Contex/Loding'; // Update import path accordingly
import { format } from 'date-fns';

interface Event {
  id: number;
  profile:string,
  eventName: string;
  eventDate: string; // Use appropriate date format
  eventTime: string; // Use appropriate time format
  location: string;
  status: boolean;
  description:string; // Assuming you want to track event approval status
}

const ManageEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const  {showApproveDialog } = useContext(ApproveDialogContext);
  const loading = useContext(LoadingContext);

  useEffect(() => {
    async function fetchEvents() {
      loading?.showLoading(true);
      try {
        const response = await axios.get('/api/admin/getevents', { withCredentials: true });
        const mappedEvents = response.data.events.map((event: any) => ({
          id: event.event_id,
          profile:event.profile,
          eventName: event.event_name,
          eventDate: format(new Date(event.event_date), 'EEEE, MMM d, yyyy'),
          eventTime: event.event_time,
          location: event.location,
          status: event.status,
          description:event.description
        }));
        setEvents(mappedEvents);
        console.log(events);
      } catch (error) {
        console.log('There was an error fetching the events data!', error);
      }
      loading?.showLoading(false);
    }

    fetchEvents();
  }, []);

  const handleView = async (index: number) => {
    console.log(events[index]);
    showApproveDialog(events[index], async () => {
      
    }, "Event Data");
  };

  const handleDelete = async (id: number) => {
    console.log(id);
    loading?.showLoading(true);
    try {
      const response = await axios.delete(`/api/event/delete/${id}`, { withCredentials: true });
      console.log('Record deleted:', response.data);
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
    } catch (err) {
      console.log('Error deleting record:', err);
    }
    loading?.showLoading(false);
  };

  return (
    <div className='m-5'>
      <Container maxWidth="xl" className="m-10 p-5 mx-auto border border-gray-300 rounded-lg shadow-lg bg-white">
        {events.length === 0 ? (
          <Typography variant='h4'>There are no upcoming events.</Typography>
        ) : (
          <Box sx={{ background: 'white' }}>
            <Typography variant="h4" gutterBottom>
              Event Details
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: 'blue' }}>
                    <TableCell sx={{ border: '1px solid #ddd', color: 'white', fontSize: 20 }}>S.No</TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', color: 'white', fontSize: 20 }}>Event Name</TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', color: 'white', fontSize: 20 }}>Event Date</TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', color: 'white', fontSize: 20 }}>Event Time</TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', color: 'white', fontSize: 20 }}>Location</TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', color: 'white', fontSize: 20 }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {events.map((event, index) => (
                    <TableRow key={event.id}>
                      <TableCell sx={{ border: '1px solid #ddd', fontSize: 18 }}>{index + 1}</TableCell>
                      <TableCell sx={{ border: '1px solid #ddd', fontSize: 18 }}>{event.eventName}</TableCell>
                      <TableCell sx={{ border: '1px solid #ddd', fontSize: 18 }}>{event.eventDate}</TableCell>
                      <TableCell sx={{ border: '1px solid #ddd', fontSize: 18 }}>{event.eventTime}</TableCell>
                      <TableCell sx={{ border: '1px solid #ddd', fontSize: 18 }}>{event.location}</TableCell>
                      <TableCell sx={{ border: '1px solid #ddd' }}>
                        <div className="flex space-x-2">
                          <Button
                            variant="contained"
                            color={ 'primary'}
                            startIcon={<Visibility />}
                            onClick={() => {
                                handleView(index);
                            }}
                            className={ "bg-blue-500 hover:bg-blue-700"}
                          >
                            {'View'}
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            startIcon={<Delete />}
                            onClick={() => handleDelete(event.id)}
                            className="bg-red-500 hover:bg-red-700"
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Container>
    </div>
  );
};

export default ManageEvents;
