import { useContext, useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Chip, Box, Grid, Container } from '@mui/material';
import { LocationOn, AccessTime } from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { LoadingContext } from '../components/Contex/Loding';

interface Event {
  event_id: number;
  event_name: string;
  profile: string;
  event_date: string;
  event_time: string;
  location: string;
  status: 'UPCOMING' | 'PAST';
}

const ViewEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();
  const loading = useContext(LoadingContext);

  const handleSearch = () => {
    console.log(inputValue.toLowerCase());
    const filtered = events.filter(event =>
      event.event_name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredEvents(filtered);
    setInputValue('');
  };

  const formatDateTime = (dateString: string, timeString: string) => {
    const [hours, minutes, seconds] = timeString.split(':');
    const eventDate = new Date(dateString);
    eventDate.setHours(parseInt(hours));
    eventDate.setMinutes(parseInt(minutes));
    eventDate.setSeconds(parseInt(seconds));
    return format(eventDate, 'MMM d, yyyy - hh:mm a');
  };

  const eventCategories = [
    { label: 'All Events', count: events.length, category: 'all' },
    { label: 'Past Events', count: events.filter(e => e.status === 'PAST').length, category: 'past' },
    { label: 'Upcoming Events', count: events.filter(e => e.status === 'UPCOMING').length, category: 'upcoming' },
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      loading?.showLoading(true);
      try {
        const response = await axios.get('/api/alumni/getevents', { withCredentials: true });
        if (response.data.status) {
          setEvents(response.data.events);
          setFilteredEvents(response.data.events);
        }
      } catch (error) {
        alert('Error occurred while fetching events', error);
      }
      loading?.showLoading(false);
    };
    fetchEvents();
  }, []);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    if (category === 'all') {
      setFilteredEvents(events);
    } else if (category === 'past') {
      setFilteredEvents(events.filter(event => event.status === 'PAST'));
    } else if (category === 'upcoming') {
      setFilteredEvents(events.filter(event => event.status === 'UPCOMING'));
    }
  };

  const handleEventClick = (id: number) => {
    navigate(`/alumni/events/${id}`);
  };

  return (
    <Container maxWidth="lg" className="m-10 mx-auto p-6 bg-gray-50 ">
    <div className='sm:flex h-screen'>
      {/* Left Sidebar - Search & Categories */}
      <div className='sm:w-1/4 p-4'>
        {/* Search Bar */}
        <div className="relative w-full mb-4">
          <input
            type="text"
            placeholder="Search events..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full border border-gray-300 p-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button onClick={handleSearch} className="absolute right-3 top-2">
            <SearchIcon className="text-gray-500" />
          </button>
        </div>

        {/* Event Categories */}
        <h3 className="font-bold mb-4">EVENT CATEGORIES</h3>
        <ul className="space-y-2">
          {eventCategories.map((category) => (
            <li
              key={category.category}
              className={`cursor-pointer p-2 rounded-lg ${activeCategory === category.category ? 'bg-indigo-400' : 'bg-gray-200'} hover:bg-indigo-300`}
              onClick={() => handleCategoryClick(category.category)}
            >
              <div className="flex justify-between">
                <span>{category.label}</span>
                <span>({category.count})</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content - Event Cards */}
      <div className='sm:w-3/4'>
        <Box className="p-6 bg-gray-50 min-w-md">
          <Typography variant="h4" className="font-bold mb-8 p-10">
            {activeCategory === 'all'
              ? 'All Events'
              : activeCategory === 'past'
              ? 'Past Events'
              : 'Upcoming Events'}
          </Typography>

          <Grid container spacing={4}>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <Grid item key={event.event_id} xs={12} sm={12} md={12} sx={{ padding: 2, background: 'grey.100' }}>
                  <Card className="flex flex-col md:flex-row shadow-lg rounded-lg overflow-hidden">
                    {/* Left Side - Event Image */}
                    <CardMedia
                      component="img"
                      className="w-full md:w-44 h-44 object-cover"
                      sx={{
                        height: 205,
                        width: '100%',
                        '@media (min-width: 768px)': {
                          width: 300,
                        },
                      }}
                      image={event.profile}
                      alt={event.event_name}
                    />

                    {/* Right Side - Event Details */}
                    <CardContent className="flex-1 p-4">
                      <div className="font-bold font-serif text-xl mb-5 truncate w-64">
                        {event.event_name}
                      </div>
                      <Box className="flex items-center space-x-2 text-gray-500 mb-2">
                        <AccessTime sx={{ color: 'black' }} />
                        <Typography variant="body2">
                          {formatDateTime(event.event_date, event.event_time)}
                        </Typography>
                      </Box>
                      <Box className="flex items-center space-x-2 text-gray-500 mb-4">
                        <LocationOn sx={{ color: 'black' }} />
                        <div className="truncate w-80">{event.location}</div>
                      </Box>
                      <Box className="flex flex-col space-x-2 justify-between md:flex-row">
                        <div className="left-5">
                          {event.status === 'PAST' ? (
                            <Chip label="Past Event" className="bg-gray-200 text-gray-600" />
                          ) : null}
                        </div>
                        <div className="right-5 w-full md:w-auto">
                          <Button
                            variant="contained"
                            color="primary"
                            sx={{
                              width: { xs: '100%', md: 'auto' },
                              marginTop: { xs: 1 },
                            }}
                            onClick={() => handleEventClick(event.event_id)}
                          >
                            View
                          </Button>
                        </div>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <div className=" pt-5 text-green-800 text-center font-medium text-2xl w-full">
                No events found.
              </div>
            )}
          </Grid>
        </Box>
      </div>
    </div>
    </Container>
  );
};

export default ViewEvents;
