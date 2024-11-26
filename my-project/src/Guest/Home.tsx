// import { useState, useEffect } from 'react';
// import { Box, IconButton } from '@mui/material';
// import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
// import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// const Home = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const images = [
//     '/slider1.png',
//     '/slider2.png',
//     '/slider3.png',
//     '/slider4.png',
//     '/slider5.png',
//   ];

//   // Automatic sliding every 5 seconds
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentIndex((prevIndex) =>
//         prevIndex === images.length - 1 ? 0 : prevIndex + 1
//       );
//     }, 5000);

//     return () => clearInterval(timer); // Cleanup timer on unmount
//   }, [images.length]);

//   const goToPrevious = () => {
//     setCurrentIndex((prevIndex) =>
//       prevIndex === 0 ? images.length - 1 : prevIndex - 1
//     );
//   };

//   const goToNext = () => {
//     setCurrentIndex((prevIndex) =>
//       prevIndex === images.length - 1 ? 0 : prevIndex + 1
//     );
//   };

//   return (
//     <Box className="relative w-full h-auto overflow-hidden">
//       {/* Slider images */}
//       <Box
//         className="flex transition-transform duration-1000"
//         style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//       >
//         {images.map((image, index) => (
//           <Box key={index} className="min-w-full h-auto rounded-md relative">
//             <img src={image} alt={`Slide ${index}`} className="w-full h-56 md:h-96 object-cover rounded-md" />
//           </Box>
//         ))}
//       </Box>

//       {/* Left Arrow */}
//       <IconButton
//         onClick={goToPrevious}
//         className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white bg-black/60 p-2 hover:bg-black/80"
//         style={{ zIndex: 10 }}  // Ensure this appears on top
//       >
//         <ArrowBackIosIcon fontSize="large" />
//       </IconButton>

//       {/* Right Arrow */}
//       <IconButton
//         onClick={goToNext}
//         className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white bg-black/60 p-2 hover:bg-black/80"
//         style={{ zIndex: 10 }}  // Ensure this appears on top
//       >
//         <ArrowForwardIosIcon fontSize="large" />
//       </IconButton>
//     </Box>
//   );
// }

// export default Home;
import { useState, useEffect } from 'react';
// import { Box, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const interval=3000;
  const images = [
    '/slider1.png',
    '/slider2.png',
    '/slider3.png',
    '/slider4.png',
    '/slider5.png',
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
const navigate =useNavigate();
  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      goToNext();
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className='bg-gray-100'>
    <div className="flex transition-transform duration-1000 bg-gray-100">
  <div className="relative w-full md:w-4/5 mx-auto py-10">
    {/* Image Section */}
    <div className="relative overflow-hidden h-[50vh] md:h-[65vh] lg:h-[80vh]">
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex}`}
        className="w-full h-full object-cover rounded-md"
      />
    </div>

    {/* Left Arrow */}
    <button
      onClick={goToPrevious}
      className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 text-black rounded-full p-2 shadow-lg"
    >
      <ArrowBackIosIcon />
    </button>

    {/* Right Arrow */}
    <button
      onClick={goToNext}
      className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 text-black rounded-full p-2 shadow-lg"
    >
      <ArrowForwardIosIcon />
    </button>

    {/* Indicators */}
    <div className="flex justify-center mt-4 space-x-2">
      {images.map((_, index) => (
        <button
          key={index}
          onClick={() => goToSlide(index)}
          className={`w-3 h-3 rounded-full ${
            currentIndex === index ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  </div>
</div>

    <div className='p-5'> </div>
    <div className="text-center py-10">
      {/* Heading */}
      <h2 className="text-2xl font-bold mb-6">Create your account and become one of us</h2>

      {/* Image Section */}
      <div className="flex justify-center mb-6">
        <img
          src="/homeelement.webp" // Replace with actual image path
          alt="Group of Users"
          className="w-2/4 h-auto rounded-full"
        />
      </div>

      {/* Login/Signup Button */}
      <Button 
        variant="contained" 
        color="primary"
        onClick={()=>{navigate('/register')}} 
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        Signup
      </Button>
    </div>
    </div>
  );
}

export default Home;

