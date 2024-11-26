import { useContext, useEffect, useState } from "react";
import { LoadingContext } from "../components/Contex/Loding";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AlertContext } from "../components/Contex/AlertDetails";
import {
  FaFacebook,
  FaWhatsapp,
  FaLinkedin,
  FaTelegram,
  FaTwitter,
  FaCopy,
  FaRegCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaExpand
} from "react-icons/fa";
import { IconButton, Chip, Dialog, DialogContent, Container } from "@mui/material"; // Added Dialog for modal

function ViewAlbum() {
  const { eventName } = useParams();
  const loading = useContext(LoadingContext);

  const [eventDetails, setEventDetails] = useState({
    eventName: '',
    itemCount: 0,
    createdDate: '',
    images: [],
    cover_image:'',
    error: '',
  });
const alert=useContext(AlertContext);
  // State for image modal
  const [openModal, setOpenModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Function to handle sharing
  const handleShare = (platform: string) => {
    const pageUrl = window.location.href;
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${pageUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${pageUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/share?url=${pageUrl}`;
        break;
      case 'copy':
        if (navigator.clipboard) {
          navigator.clipboard.writeText(pageUrl)
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
          textArea.value = pageUrl;
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
        return;
      default:
        return;
    }

    window.open(shareUrl, '_blank');
  };

  // Function to open modal and display an image
  const openImageModal = (index: number) => {
    setCurrentImageIndex(index);
    setOpenModal(true);
  };

  // Function to navigate images
  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % eventDetails.images.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + eventDetails.images.length) % eventDetails.images.length);
  };

  useEffect(() => {
    loading?.showLoading(true, "loading...");
    const fetchEventData = async () => {
      try {
        const response = await axios.get(`/api/gallery/${eventName}`, {
          withCredentials: true,
        });
        console.log(response.data);
        const { event_name, item_count, created_date, images,cover_image } = response.data;
       
        setEventDetails({
          eventName: event_name,
          itemCount: item_count,
          createdDate: created_date,
          images: images,
          cover_image:cover_image,
          error: '',
        });
        loading?.showLoading(false);
      } catch (err) {
        console.error(err);
        setEventDetails(prev => ({
          ...prev,
          error: 'Failed to load event data',
        }));
        loading?.showLoading(false);
      }
    };

    fetchEventData();
  }, []);


  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  }
  return (
    <Container maxWidth="md" className="m-10 mx-auto p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
    <div className="p-5">
      {eventDetails.error && <p className="text-red-500">{eventDetails.error}</p>}

      
        <h2 className="text-3xl font-medium text-center p-5">
          {eventDetails.eventName}
        </h2>

        <div className="flex  flex-col mb-5 md:justify-between md:flex-row">
        <div className="mb-5 text-sm text-gray-600 space-x-5">
        <span>{eventDetails.itemCount} Items</span>
        <span>
          <FaRegCalendarAlt className="inline-block mr-2" /> {formatDate(eventDetails.createdDate)}
        </span>
      </div>
        <div className="flex items-center gap-2">
          <span>Share:</span>
          <IconButton onClick={() => handleShare('facebook')}>
            <FaFacebook size={20} className="text-blue-600" />
          </IconButton>
          <IconButton onClick={() => handleShare('whatsapp')}>
            <FaWhatsapp size={20} className="text-green-500" />
          </IconButton>
          <IconButton onClick={() => handleShare('linkedin')}>
            <FaLinkedin size={20} className="text-blue-700" />
          </IconButton>
          <IconButton onClick={() => handleShare('telegram')}>
            <FaTelegram size={20} className="text-blue-400" />
          </IconButton>
          <IconButton onClick={() => handleShare('twitter')}>
            <FaTwitter size={20} className="text-blue-500" />
          </IconButton>
          <IconButton onClick={() => handleShare('copy')} className="ml-2">
            <FaCopy size={20} className="text-gray-500" />
          </IconButton>
        </div>
        </div>

      

      {/* Grid of images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {eventDetails.images.length > 0 ? (
          eventDetails.images.map((imageUrl, index) => (
            <div key={index} className="relative">
              <img
                src={imageUrl}
                alt={`Event Image ${index}`}
                className="w-full h-auto object-cover rounded-lg shadow-md cursor-pointer"
                onClick={() => openImageModal(index)} // Click event to open modal
              />
              {/* If this is the cover image, display the "Cover Image" chip */}
              
              {index === 0 && (
                <Chip
                  label="Cover Image"
                  color="secondary"
                  className="absolute top-2 left-2 text-orange-700"
                />
              )}
            </div>
          ))
        ) : (
          <p className="text-center">No images found for this event.</p>
        )}
      </div>

      {/* Modal for image preview */}
      <Dialog
  open={openModal}
  onClose={() => setOpenModal(false)}
  maxWidth="lg"
  fullWidth
>
  <DialogContent sx={{ position: 'relative', height: { xs: '50vh', md: '65vh', lg: '80vh' } }}>
    {/* Image with controls */}
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <img
        src={eventDetails.images[currentImageIndex]}
        alt={`Full view image ${currentImageIndex}`}
        style={{ width: 'auto', height: '100%', objectFit: 'contain' }}
      />

      {/* Left Arrow */}
      <IconButton
        onClick={handlePrev}
        sx={{
          position: 'absolute',
          left: { xs: 2, md: 4 },
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'black',
          p: 2,
          boxShadow: 2,
          '&:hover': {
            bgcolor: 'white',
          },
        }}
      >
        <FaChevronLeft size={32} />
      </IconButton>

      {/* Right Arrow */}
      <IconButton
        onClick={handleNext}
        sx={{
          position: 'absolute',
          right: { xs: 2, md: 4 },
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'black',
          p: 2,
          boxShadow: 2,
        }}
      >
        <FaChevronRight size={32} />
      </IconButton>

      {/* Close/Expand Icon */}
      <IconButton
        onClick={() => setOpenModal(false)}
        sx={{
          position: 'absolute',
          top: 2,
          right: 2,
          bgcolor: 'white',
          color: 'black',
          p: 1,
          boxShadow: 2,
        }}
      >
        <FaExpand size={20} />
      </IconButton>
    </div>
  </DialogContent>
</Dialog>
    </div>
    </Container>
  );
}


export default ViewAlbum;