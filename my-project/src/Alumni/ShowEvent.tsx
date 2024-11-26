import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Card, Typography, IconButton, Stack, Button, Divider, Container } from '@mui/material';
import { LocationOn, AccessTime, CalendarToday, Close, ContentCopy, Cookie } from '@mui/icons-material';
import { Facebook, WhatsApp, LinkedIn, Telegram, Twitter } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { LoadingContext } from '../components/Contex/Loding';
import QuillEditor from '../components/Editor/QuillEditor';
import { AlertContext } from '../components/Contex/AlertDetails';
interface EventData {
  profile: string,
  event_name: string;
  event_time: string;
  event_date: string;
  location: string;
  description: string;
  status: 'UPCOMING' | 'PAST';
}

const ShowEvent: React.FC = () => {
  const loading = useContext(LoadingContext);
  const [eventData, setEventData] = useState<EventData | null>(null);
const alert=useContext(AlertContext);
  const formatDateTime = (dateString: string, timeString: string) => {
    const [hours, minutes, seconds] = timeString.split(':'); // Parse the time
    const eventDate = new Date(dateString);
    eventDate.setHours(parseInt(hours));
    eventDate.setMinutes(parseInt(minutes));
    eventDate.setSeconds(parseInt(seconds));

    return format(eventDate, "MMM d, yyyy - hh:mm a");
  };

  const { id } = useParams(); // Get the alumni ID from the URL
  useEffect(() => {
    loading?.showLoading(true);
    async function fetchAlumniDetail() {
      try {
        const response = await axios.get(`/api/event/${id}`, {
          withCredentials: true
        });
        setEventData(response.data.event);
      } catch (error) {
        console.log("Error fetching alumni details:", error);
      }
    }
    loading?.showLoading(false);
    fetchAlumniDetail();
  }, [id]);
  const currentUrl = window.location.href;

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`, '_blank');
  };

  const shareOnWhatsApp = () => {
    window.open(`https://wa.me/?text=${currentUrl}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${currentUrl}`, '_blank');
  };

  const shareOnTelegram = () => {
    window.open(`https://telegram.me/share/url?url=${currentUrl}`, '_blank');
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${currentUrl}`, '_blank');
  };


  const copyLink = () => {
    const url = window.location.href;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
        .then(() => {
          alert?.showAlert("Event link copied to clipboard!","info");
        })
        .catch(err => {
          console.error("Failed to copy text: ", err);
          alert?.showAlert("Failed to copy the event link.","info");
        });
    } else {
      // Fallback for browsers without clipboard API support
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        alert?.showAlert("Event link copied to clipboard!","info");
      } catch (err) {
        console.error("Fallback: Oops, unable to copy", err);
      }
      document.body.removeChild(textArea);
    }
  };
  const handleJoinEvent = async (eventName: string) => {
    try {
      console.log(eventName);
      const response = await axios.post("/api/events/join", {
        eventName: eventName,
        //userId: currentUser.id,  // Ensure user ID is available
      });
      if (response.status === 200) {
        alert?.showAlert("You have joined the event!","success");
      }
    } catch (error) {
      console.error("Error joining event", error);
    }
  };
  

  const addToCalendar = () => {
    const icsData = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${eventData?.event_name}
DTSTART:${eventData?.event_date.replace(/-/g, '')}T${eventData?.event_time.replace(/:/g, '')}Z
LOCATION:${eventData?.location}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsData], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${eventData?.event_name}.ics`;
    link.click();
  };

  if (!eventData) {
    return <Typography>Loading event details...</Typography>;
  }

  return (
    <div className="m-0 p-6 min-h-screen ">
    <div className=" w-full h-auto md:h-48 md:bg-gray-500">
      <div className="flex flex-col md:flex-row p-4">
        <div className=''>
          <Box className="p-4 lg:p-8 max-w-md mx-auto">
            <Card className="shadow-lg rounded-lg overflow-hidden">
              <img
                src={eventData.profile}
                alt={eventData.event_name}
                className="w-full h-64 object-cover"
              />
              <Box className="p-4 bg-white">
                <Typography variant="h6" className="font-bold mb-2">
                  DATE & TIME:
                </Typography>
                <Typography variant="body2" className="text-gray-700 mb-1">
                  Start: <strong>{formatDateTime(eventData.event_date, eventData.event_time)}</strong>
                </Typography>
                <Typography variant="caption" className="text-gray-500">
                  (as per your local time, India Standard Time)
                </Typography>
                <div>
                <Button
  onClick={() => handleJoinEvent(eventData.event_name)}
  disabled={!sessionStorage.getItem("name")}
  variant="outlined"
  color="primary"
  sx={{ display: eventData.status === 'PAST' ? 'none' : 'inline-block' }}
>
  Join Event
</Button></div>
                <Box className="mt-4">
              <Button variant="outlined" color="primary" disabled={(eventData.status==='PAST')} startIcon={<CalendarToday />} onClick={addToCalendar}>
                Add to Calendar
              </Button>
            </Box>
                {/* <Box className="mt-4">
                  <span className='ml-4 px-2 py-1 rounded-lg text-sm font-semibold bg-purple-100 text-purple-600'>
                    {eventData.status}
                  </span>
                </Box> */}

                {/* Social Media Icons + Copy Link */}
                <Stack direction="row" spacing={2} className="mt-4">
                  <IconButton color="primary" onClick={copyLink}>
                    <ContentCopy />
                  </IconButton>
                  <IconButton color="primary" onClick={shareOnFacebook}>
                    <Facebook />
                  </IconButton>
                  <IconButton color="primary" onClick={shareOnWhatsApp}>
                    <WhatsApp />
                  </IconButton>
                  <IconButton color="primary" onClick={shareOnLinkedIn}>
                    <LinkedIn />
                  </IconButton>
                  <IconButton color="primary" onClick={shareOnTelegram}>
                    <Telegram />
                  </IconButton>
                  <IconButton color="primary" onClick={shareOnTwitter}>
                    <Twitter />
                  </IconButton>
                </Stack>
              </Box>
            </Card>
          </Box>
        </div>

        {/* Right Section: Event Name, Date, Time, Description, Add to Calendar */}
        <div className="md:w-3/5 h-full md:bg-inherit border-2 md:border-0 bg-white pt-10 mt-9 rounded-md">
          <Box className="flex-1 space-y-4 p-4">
            <h2 className="font-bold font-serif text-ellipsis text-3xl text-black md:text-white">{eventData.event_name}</h2>
            <Stack direction="row" alignItems="center" spacing={1}>
              <AccessTime className="md:text-white text-black" />
              <Typography variant="body2" className="text-black md:text-white">
                {format(new Date(eventData.event_date), 'EEEE, MMM d, yyyy')}
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
              <LocationOn className="text-black" />
              <div className="text-slate-950 font-semibold">
                Address
              </div></Stack>
            <div>{eventData.location}</div>

            <Divider className='text-slate-900 w-full p-1'></Divider>

            {/* Description */}
            <Typography variant="h6" className="font-bold">Description</Typography>
            <QuillEditor content={eventData.description} />

            {/* Add to Calendar Button */}
            
          </Box>
          

        </div>
      </div>
    </div>
    </div>
  );
};

export default ShowEvent;
