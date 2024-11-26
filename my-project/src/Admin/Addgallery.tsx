import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
} from '@mui/material';
import { LoadingContext } from '../components/Contex/Loding';
import { AlertContext } from '../components/Contex/AlertDetails';
const Addgallery = () => {
  const [events, setEvents] = useState<string[]>([]); // List of event names from backend
  const [selectedEvent, setSelectedEvent] = useState(''); // Selected event
  const [images, setImages] = useState<FileList | null>(null); // Uploaded images
  const alertContext=useContext(AlertContext);
  const [coverImageIndex, setCoverImageIndex] = useState<number | null>(null); // Index for cover image
  // const [loading, setLoading] = useState(false);
 const loading=useContext(LoadingContext);
  // Fetch events from the backend when the component loads
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/admin/events/getnames', {
          withCredentials: true,
        });
        const eventNames = response.data.names.map((event) => event.event_name);
        setEvents(eventNames);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  // Handle event selection
  const handleEventChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedEvent(event.target.value as string);
  };

  // Handle image upload with validation (size and format)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = e.target.files;
      let valid = true;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileType = file.type;
        const fileSize = file.size / 1024 / 1024; // Convert bytes to MB

        if (fileSize > 2) {
          alert(`File ${file.name} exceeds the 2MB limit.`);
          valid = false;
          break;
        }

        if (!['image/png', 'image/jpg', 'image/jpeg'].includes(fileType)) {
          alert(`File ${file.name} is not a valid format. Only PNG, JPG, and JPEG are allowed.`);
          valid = false;
          break;
        }
      }

      if (valid) {
        setImages(files);
      } else {
        setImages(null); // Reset images if validation fails
      }
    }
  };

  // Handle cover image selection
  const handleCoverImageChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setCoverImageIndex(e.target.value as number);
  };

  // Handle form submission
  // Handle form submission
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedEvent || !images) {
    alert('Please select an event and upload images.');
    return;
  }
  loading?.showLoading(true, "uploading....");
  const formData = new FormData();
  formData.append('event_name', selectedEvent);

  // Set the cover image based on the selected index or default to the first image
  const coverImage = coverImageIndex !== null && images.length > coverImageIndex
    ? images[coverImageIndex]
    : images[0];
console.log(coverImage);
  formData.append('cover_image', coverImage); // Set the cover image

  // Append all images to formData
  for (let i = 0; i < images.length; i++) {
    formData.append('images', images[i]);
  }
console.log(formData)
  try {
    await axios.post('/api/admin/savegallery', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    alertContext?.showAlert('Gallery added successfully!', "success");
    setSelectedEvent('');
    setImages(null);
    setCoverImageIndex(null);
    
    // Reset the file input field
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  } catch (error) {
    console.log('Error uploading images:', error);
    alertContext?.showAlert('Failed to upload images', 'error');
  } finally {
    loading?.showLoading(false);
  }
};


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Add Gallery</h1>
          <form onSubmit={handleSubmit}>
            {/* Event Selection */}
            <FormControl fullWidth className="mb-4">
              <InputLabel id="event-label">Select Event</InputLabel>
              <Select
                labelId="event-label"
                id="event-select"
                value={selectedEvent}
                onChange={handleEventChange}
                label="Select Event"
              >
                {events.map((event) => (
                  <MenuItem key={event} value={event}>
                    {event}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Image Upload */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold">Upload Images</label>
              <input
                type="file"
                multiple
                accept="image/png, image/jpg, image/jpeg"
                onChange={handleImageChange}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <FormHelperText>Max size 2MB. Only PNG, JPG, and JPEG formats are accepted.</FormHelperText>
            </div>

            {/* Cover Image Selection */}
            {images && (
  <div className="mb-4">
    <label className="block mb-2 font-semibold">Select Cover Image</label>
    <div className="grid grid-cols-3 gap-2">
      {Array.from(images).map((image, index) => (
        <div key={index} className="relative">
          <img
            src={URL.createObjectURL(image)}
            alt={image.name}
            className="w-full h-auto border rounded"
          />
          <input
            type="radio"
            name="coverImage"
            value={index}
            checked={coverImageIndex === index}
            onChange={() => setCoverImageIndex(index)}
            className="absolute bottom-0 right-0 m-2"
          />
        </div>
      ))}
    </div>
  </div>
)}


            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              Submit
            </Button>
          </form>
      </div>
    </div>
  );
};

export default Addgallery;
