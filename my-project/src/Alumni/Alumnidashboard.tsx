// // AlumniDashboard.tsx
// import React, { useEffect, useState } from 'react';
// import { Box, Button, Card, CardContent, Typography, Grid } from '@mui/material';
// import axios from 'axios';

// interface Event {
//   id: number;
//   name: string;
//   date: string;
// }

// interface Job {
//   id: number;
//   title: string;
//   company: string;
// }

// interface GalleryImage {
//   id: number;
//   url: string;
// }

// const AlumniDashboard: React.FC = () => {
//   // State to hold fetched data
//   const [events, setEvents] = useState<Event[]>([]);
//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [gallery, setGallery] = useState<GalleryImage[]>([]);

//   // Fetching data using useEffect
//   useEffect(() => {
//     // Fetch events
//     axios.get('/api/alumni/getevents',{withCredentials:true}).then((response) => {
//       setEvents(response.data.events);
//     });

//     // Fetch jobs
//     axios.get('/api/alumni/jobsforcards',{withCredentials:true}).then((response) => {
//       setJobs(response.data.jobsforcard);
//     });

//     // Fetch gallery images
//     axios.get('/api/gallery',{withCredentials:true}).then((response) => {
//       setGallery(response.data);
//     });
//   }, []);

//   // Handlers for buttons
//   const handleRSVP = (eventId: number) => {
//     alert(`RSVP for Event ID: ${eventId}`);
//   };

//   const handleSeeDetails = (id: number, type: string) => {
//     alert(`See details for ${type} ID: ${id}`);
//   };

//   const handleApply = (jobId: number) => {
//     alert(`Applied for Job ID: ${jobId}`);
//   };

//   const handleUploadPhoto = () => {
//     alert('Upload photo clicked');
//   };

//   return (
//     <div className="p-8">
//       {/* Events Section */}
//       <Section title="Upcoming Events">
//         <Grid container spacing={2} className="overflow-x-auto">
//           {events.map((event) => (
//             <Grid item xs={12} md={4} key={event.id}>
//               <EventCard event={event} onRSVP={() => handleRSVP(event.id)} onSeeDetails={() => handleSeeDetails(event.id, 'event')} />
//             </Grid>
//           ))}
//         </Grid>
//       </Section>

//       {/* Gallery Section */}
//       <Section title="Gallery">
//         <Grid container spacing={2} className="overflow-x-auto">
//           {gallery.map((image) => (
//             <Grid item xs={6} md={3} key={image.id}>
//               <Box className="bg-gray-200 h-40 w-full" style={{ backgroundImage: `url(${image.url})`, backgroundSize: 'cover' }}></Box>
//             </Grid>
//           ))}
//         </Grid>
//         <Button variant="contained" color="primary" className="mt-4" onClick={handleUploadPhoto}>
//           Upload Photo
//         </Button>
//       </Section>

//       {/* Jobs Section */}
//       <Section title="Jobs">
//         <Grid container spacing={2} className="overflow-x-auto">
//           {jobs.map((job) => (
//             <Grid item xs={12} md={4} key={job.id}>
//               <JobCard job={job} onApply={() => handleApply(job.id)} onSeeDetails={() => handleSeeDetails(job.id, 'job')} />
//             </Grid>
//           ))}
//         </Grid>
//       </Section>
//     </div>
//   );
// };

// // Section Component
// const Section: React.FC<{ title: string }> = ({ title, children }) => (
//   <Box className="mb-10">
//     <Typography variant="h4" className="mb-4">
//       {title}
//     </Typography>
//     <Box className="bg-white p-6 rounded-lg shadow-lg">{children}</Box>
//   </Box>
// );

// // Event Card Component
// const EventCard: React.FC<{ event: Event; onRSVP: () => void; onSeeDetails: () => void }> = ({ event, onRSVP, onSeeDetails }) => (
//   <Card className="bg-gray-100">
//     <CardContent>
//       <Typography variant="h6">{event.name}</Typography>
//       <Typography variant="body2">Date: {event.date}</Typography>
//       <Button variant="contained" color="primary" className="mt-2" onClick={onRSVP}>
//         RSVP
//       </Button>
//       <Button variant="outlined" color="secondary" className="mt-2 ml-2" onClick={onSeeDetails}>
//         See Details
//       </Button>
//     </CardContent>
//   </Card>
// );

// // Job Card Component
// const JobCard: React.FC<{ job: Job; onApply: () => void; onSeeDetails: () => void }> = ({ job, onApply, onSeeDetails }) => (
//   <Card className="bg-gray-100">
//     <CardContent>
//       <Typography variant="h6">{job.title}</Typography>
//       <Typography variant="body2">Company: {job.company}</Typography>
//       <Button variant="contained" color="primary" className="mt-2" onClick={onApply}>
//         Apply
//       </Button>
//       <Button variant="outlined" color="secondary" className="mt-2 ml-2" onClick={onSeeDetails}>
//         See Details
//       </Button>
//     </CardContent>
//   </Card>
// );

// export default AlumniDashboard;
import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Card, CardContent, Typography, Grid } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import clsx from 'clsx';
import { AccessTime, LocationOn } from '@mui/icons-material';
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

interface Job {
  id: number;
  job_type: 'Job' | 'Internship';
  job_title: string;
  company_name: string;
  location: string;
  salary?: string;
  stipend?: string;
  deadline: string;
  posted_date: string;
  role: 'admin' | 'alumni';
  user_name: string;
  user_avatar: string;
}

interface GalleryImage {
  event_name: string;
  cover_image: string;
  total_items: string;
  event_type: 'Reunions' | 'Workshops and Seminars' | 'Mentorship Programs' | 'Cultural and Social Events' | 'Others';
}

const AlumniDashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
const loading=useContext(LoadingContext);
  useEffect(() => {
    // Fetch events
    loading?.showLoading(true,"Loading...");
    axios.get('/api/alumni/getevents', { withCredentials: true }).then((response) => {
      setEvents(response.data.events);
    });

    // Fetch jobs
    axios.get('/api/alumni/jobsforcards', { withCredentials: true }).then((response) => {
      setJobs(response.data.jobsforcard);
    });

    // Fetch gallery images
    axios.get('/api/alumni/galery').then((response) => {
      if (Array.isArray(response.data.galleries)) {
        setGallery(response.data.galleries);
      } else {
        setGallery([]);
      }
    }).catch(error => {
      console.error("Error fetching gallery data:", error);
      setGallery([]);
    });
    loading?.showLoading(false);
  }, []);

  const navigate = useNavigate();

  const handleSeeDetails = (id: number, type: string) => {
    if (type === 'job') {
      navigate(`/alumni/jobs/${id}`);
    } else if (type === 'event') {
      navigate(`/alumni/events/${id}`);
    }
  };

  const handleUploadPhoto = () => {
    navigate("/alumni/gallery/add images");
  };

  function handleImageClick(eventName: string): void {
    navigate(`/alumni/gallery/${eventName}`);
  }

  // Filter upcoming events based on the status
  const upcomingEvents = events.filter((event) => event.status === 'UPCOMING');

  // Filter jobs based on deadline (greater than today)
  const upcomingJobs = jobs.filter((job) => new Date(job.deadline) > new Date());

  return (
    <div className="p-8">
      {/* Events Section */}
      <Section title="Upcoming Events">
        <Grid container spacing={2} className="overflow-x-auto">
          {upcomingEvents.map((event) => (
            <Grid item xs={12} md={4} key={event.event_id}>
              <EventCard event={event} onSeeDetails={() => handleSeeDetails(event.event_id, 'event')} />
            </Grid>
          ))}
        </Grid>
      </Section>

      {/* Gallery Section */}
      <Section title="Gallery">
        <Grid container spacing={2} className="overflow-x-auto">
          {gallery.map((event) => (
            <Grid item xs={6} md={3}>
              <div className="block cursor-pointer" onClick={() => handleImageClick(event.event_name)}>
                <div className="gallery-item group w-full rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="relative w-full aspect-square bg-white rounded-md overflow-hidden">
                    <img src={event.cover_image} alt={event.event_name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex justify-between p-4 bg-white shadow-sm">
                    <h2 className="text-lg font-semibold">{event.event_name}</h2>
                    <p className="text-sm text-gray-500">{event.total_items} Items</p>
                  </div>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
        <Button variant="contained" color="primary" className="mt-4" onClick={handleUploadPhoto}>
          Upload Photo
        </Button>
      </Section>

      {/* Jobs Section */}
      <Section title="Upcoming Jobs">
        <Grid container spacing={2} className="overflow-x-auto">
          {upcomingJobs.map((job) => (
            <Grid item xs={12} md={4} key={job.id}>
              <JobCard job={job} onSeeDetails={() => handleSeeDetails(job.id, 'job')} />
            </Grid>
          ))}
        </Grid>
      </Section>
    </div>
  );
};

// Section Component
const Section: React.FC<{ title: string }> = ({ title, children }) => (
  <Box className="mb-10">
    <Typography variant="h4" className="mb-4">
      {title}
    </Typography>
    <Box className="bg-white p-6 rounded-lg shadow-lg">{children}</Box>
  </Box>
);

// Event Card Component
const EventCard: React.FC<{ event: Event; onSeeDetails: () => void }> = ({ event, onSeeDetails }) => (
  <Card className="bg-gray-100" sx={{ background: '#FFE4E6' }}>
    <CardContent>
      <div className="font-bold font-serif text-xl mb-5 truncate w-64">{event.event_name}</div>
      <Box className="flex items-center space-x-2 text-gray-500 mb-2">
        <AccessTime sx={{ color: 'black' }} />
        <Typography variant="body2">{formatDateTime(event.event_date, event.event_time)}</Typography>
      </Box>
      <Box className="flex items-center space-x-2 text-gray-500 mb-4">
        <LocationOn sx={{ color: 'black' }} />
        <div className="truncate w-80">{event.location}</div>
      </Box>
      <Button variant="outlined" color="secondary" className="mt-2 ml-2" onClick={onSeeDetails} sx={{ background: '#20C997' }}>
        See Details
      </Button>
    </CardContent>
  </Card>
);

// Job Card Component
const JobCard: React.FC<{ job: Job; onSeeDetails: () => void }> = ({ job, onSeeDetails }) => (
  <Card className="bg-gray-100">
    <CardContent sx={{ background: '#FAF3E0' }}>
      <div className="flex justify-between relative">
        <div>
          <span className="text-lg font-serif font-semibold">{job.job_title}{' '}</span>
          | <span>{job.company_name}</span>
          <br />
          <div className="text-sm text-gray-700 font-serif">
            <p>Location: {job.location}</p>
            <p>Deadline: {formatDate(job.deadline)}</p>
          </div>
        </div>
        <div className="flex flex-row items-end space-x-2 absolute top-5 right-5">
          <span className={clsx('px-2 py-1 rounded-lg text-xs font-semibold mb-2', job.job_type === 'Internship' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600')}>
            {job.job_type}
          </span>
        </div>
      </div>
      <Button variant="outlined" color="secondary" className="mt-2 ml-2" onClick={onSeeDetails} sx={{ background: '#20C997' }}>
        See Details
      </Button>
    </CardContent>
  </Card>
);

export default AlumniDashboard;

function formatDateTime(dateString: string, timeString: string): React.ReactNode {
  const [hours, minutes, seconds] = timeString.split(':');
  const eventDate = new Date(dateString);
  eventDate.setHours(parseInt(hours));
  eventDate.setMinutes(parseInt(minutes));
  eventDate.setSeconds(parseInt(seconds));
  return format(eventDate, 'MMM d, yyyy - hh:mm a');
}

function formatDate(dateString: string): React.ReactNode {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
}
