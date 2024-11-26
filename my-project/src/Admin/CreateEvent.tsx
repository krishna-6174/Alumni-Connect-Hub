import { useContext, useState } from 'react';
import { TextField, Button, InputAdornment, Container, Autocomplete } from '@mui/material';
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Event, CalendarToday, LocationOn } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LoadingContext } from '../components/Contex/Loding';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import dayjs from 'dayjs';
import RichTextEditor from '../components/Custom/RichTextEditor';

const eventTypes = [
  'Reunions',
  'Workshops and Seminars',
  'Mentorship Programs',
  'Cultural and Social Events',
  'Others'
];

const CreateEvent = () => {
  const { handleSubmit, control, reset } = useForm();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bannerError, setBannerError] = useState('');
  const [banner, setBanner] = useState(null);
  const [selectedEventType, setSelectedEventType] = useState('');
  const loading = useContext(LoadingContext);

  const onSubmit = async (data) => {
    const { eventName, eventDescription, eventDate, eventTime, location } = data;

    if (dayjs(eventDate).isBefore(dayjs())) {
      alert("Event date must be in the future.");
      return;
    }

    // Validate Banner Size and Type
    if (banner) {
      const fileSize = banner.size / 1024 / 1024; // in MB
      const fileType = banner.type;
      if (fileSize > 2) {
        setBannerError("Image size must be less than 2MB.");
        return;
      }
      if (!["image/jpeg", "image/jpg", "image/png"].includes(fileType)) {
        setBannerError("Image must be in JPG, JPEG, or PNG format.");
        return;
      }
    }

    try {
      loading?.showLoading(true);
      const formData = new FormData();
      formData.append('eventName', eventName);
      formData.append('eventDescription', eventDescription);
      formData.append('eventDate', eventDate);
      formData.append('eventTime', eventTime);
      formData.append('location', location);
      formData.append('eventType', selectedEventType); // Add eventType to formData
      if (banner) formData.append('eventBanner', banner);

      const response = await axios.post('/api/admin/addEvent', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Correct content type for FormData
        },
        withCredentials: true, // Ensures cookies are sent with the request
      });
      loading?.showLoading(false);
      if (response.status) {
        alert("Event created successfully!");
        reset();
        setBanner(null);
        setSelectedEventType(''); // Reset event type
      }
    } catch (error) {
      console.error("Error creating event", error);
      alert("Failed to create event.");
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    setBanner(file);
    setBannerError(null);
  };

  return (
    <Container maxWidth="md" className="m-10 mx-auto p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
      <div className='text-center'>
        <label className='font-bold text-3xl'>Add Event</label>
      </div>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div className="container mx-auto p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Event Banner */}
            <div>
              <label htmlFor="eventBanner" className="block text-sm font-medium text-gray-700">
                Event Banner (JPG/JPEG/PNG, less than 2MB)
              </label>
              <input
                type="file"
                id="eventBanner"
                accept="image/jpeg, image/jpg, image/png"
                onChange={handleBannerChange}
                className="mt-1"
              />
              {bannerError && <p className="text-red-500 text-sm">{bannerError}</p>}
            </div>

            {/* Event Name */}
            <Controller
              name="eventName"
              control={control}
              defaultValue=""
              rules={{ required: "Event name is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Event Name"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Event />
                      </InputAdornment>
                    ),
                  }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            <div className='flex flex-row justify-between'>
              <div>
                {/* Event Date */}
                <Controller
                  name="eventDate"
                  control={control}
                  defaultValue={null}
                  rules={{ required: "Event date is required" }}
                  render={({ field, fieldState }) => (
                    <DatePicker
                      {...field}
                      label="Event Date"
                      inputFormat="MM/dd/yyyy"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarToday />
                              </InputAdornment>
                            ),
                          }}
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                        />
                      )}
                      value={selectedDate}
                      onChange={(date) => {
                        field.onChange(date);
                        setSelectedDate(date);
                      }}
                    />
                  )}
                />
              </div>
              <div>
                {/* Event Time */}
                <Controller
                  name="eventTime"
                  control={control}
                  defaultValue={null}
                  rules={{ required: "Event time is required" }}
                  render={({ field, fieldState }) => (
                    <TimePicker
                      {...field}
                      label="Event Time"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarToday />
                              </InputAdornment>
                            ),
                          }}
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                        />
                      )}
                      value={selectedTime}
                      onChange={(time) => {
                        field.onChange(time);
                        setSelectedTime(time);
                      }}
                    />
                  )}
                />
              </div>
            </div>

            {/* Event Type */}
            <Autocomplete
              options={eventTypes}
              value={selectedEventType}
              onChange={(event, newValue) => setSelectedEventType(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Event Type"
                  placeholder="Select Event Type"
                  fullWidth
                />
              )}
            />

            {/* Location */}
            <Controller
              name="location"
              control={control}
              defaultValue=""
              rules={{ required: "Location is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Location"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn />
                      </InputAdornment>
                    ),
                  }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />

            {/* Event Description */}
            <Controller
              name="eventDescription"
              control={control}
              defaultValue=""
              rules={{ required: "Event description is required" }}
              render={({ field, fieldState }) => (
                <div className="mb-4">
                  <h3 className="text-lg text-red-600 my-2">Event Description*</h3>
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                    sourcePage=""
                  />
                  {fieldState.error && (
                    <p className="text-red-600 text-sm mt-2">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            <div className="flex justify-between">
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
              <Button onClick={() => reset()} variant="outlined">
                Clear
              </Button>
            </div>
          </form>
        </div>
      </LocalizationProvider>
    </Container>
  );
};

export default CreateEvent;
