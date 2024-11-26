import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface Galleries {
  event_name: string;
  cover_image: string;
  total_items: string;
  event_type: 'Reunions' | 'Workshops and Seminars' | 'Mentorship Programs' | 'Cultural and Social Events' | 'Others';
}

const Gallery = () => {
  const [events, setEvents] = useState<Galleries[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Galleries[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch gallery events
    axios.get('/api/galery')
      .then(res => {
        setEvents(res.data.galleries);
        setFilteredEvents(res.data.galleries); // Set initially filtered to all events
        calculateCategoryCounts(res.data.galleries);
      })
      .catch(err => console.error(err));
  }, []);

  const calculateCategoryCounts = (galleries: Galleries[]) => {
    const counts: Record<string, number> = {
      Reunions: 0,
      'Workshops and Seminars': 0,
      'Mentorship Programs': 0,
      'Cultural and Social Events': 0,
      Others: 0,
    };
    galleries.forEach(gallery => {
      counts[gallery.event_type] += 1;
    });
    setCategoryCounts(counts);
  };

  // Search functionality
  const handleSearch = () => {
    const filtered = events.filter(event =>
      event.event_name.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredEvents(filtered);
    setInputValue('');
  };

  // Category filter functionality
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    if (category === 'all') {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter(event => event.event_type === category));
    }
  };

  // Handle image click and forward event name
  const handleImageClick = (eventName: string) => {
    navigate(`/gallery/${eventName}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <Container maxWidth="lg" className="m-10 mx-auto p-6 bg-gray-50 flex-grow">
        <div className="sm:flex h-full p-4">
          {/* Left Sidebar - Search & Categories */}
          <div className="sm:w-1/4 p-4">
            {/* Search Bar */}
            <div className="relative w-full mb-4">
              <input
                type="text"
                placeholder="Search galleries..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full border border-gray-300 p-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button onClick={handleSearch} className="absolute right-3 top-2">
                <SearchIcon className="text-gray-500" />
              </button>
            </div>

            {/* Gallery Categories */}
            <h3 className="font-bold mb-4">GALLERY CATEGORIES</h3>
            <ul className="space-y-2">
              <li
                className={`cursor-pointer p-2 rounded-lg ${activeCategory === 'all' ? 'bg-indigo-400' : 'bg-gray-200'} hover:bg-indigo-300`}
                onClick={() => handleCategoryClick('all')}
              >
                <div className="flex justify-between">
                  <span>All Galleries</span>
                  <span>({events.length})</span>
                </div>
              </li>
              {Object.entries(categoryCounts).map(([category, count]) => (
                <li
                  key={category}
                  className={`cursor-pointer p-2 rounded-lg ${activeCategory === category ? 'bg-indigo-400' : 'bg-gray-200'} hover:bg-indigo-300`}
                  onClick={() => handleCategoryClick(category)}
                >
                  <div className="flex justify-between">
                    <span>{category}</span>
                    <span>({count})</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Gallery Grid */}
          <div className="sm:w-3/4">
            <Container maxWidth="md" sx={{ marginTop: '2rem' }}>
              <div className="gallery-page p-4">
                <h1 className="text-3xl font-bold mb-8 text-center">Gallery</h1>
                {/* Container for the gallery grid */}
                {filteredEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredEvents.map((event, index) => (
                      <div
                        key={index}
                        className="block cursor-pointer"
                        onClick={() => handleImageClick(event.event_name)}
                      >
                        {/* Gallery item with equal height and width, responsive to screen size */}
                        <div className="gallery-item group w-full rounded-md overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                          {/* Ensuring image container maintains a square aspect ratio */}
                          <div className="relative w-full aspect-square bg-white rounded-md overflow-hidden">
                            <img
                              src={event.cover_image}
                              alt={event.event_name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {/* Display event name and item count */}
                          <div className="flex justify-between p-4 bg-white shadow-sm">
                            <h2 className="text-lg font-semibold">{event.event_name}</h2>
                            <p className="text-sm text-gray-500">{event.total_items} Items</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="pt-5 text-green-800 text-center font-medium text-2xl w-full">
                    No Gallery found.
                  </div>
                )}
              </div>
            </Container>
          </div>
        </div>
      </Container>

      
    </div>
  );
};

export default Gallery;
