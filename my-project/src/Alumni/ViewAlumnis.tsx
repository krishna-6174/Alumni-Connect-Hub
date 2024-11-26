import React, { useContext, useEffect, useState } from 'react';
import { Card, CardActionArea, Typography, Container } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LoadingContext } from '../components/Contex/Loding';
import SearchIcon from '@mui/icons-material/Search';

interface Alumniforcard {
  id: number;
  Name: string;
  profile: string | null;
  Department: string;
  PassedOutYear: number;
}

const AlumniCard = ({ profile, Name, Department, PassedOutYear, onClick }) => {
  return (
    <Card
      className="w-72 h-80 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300 cursor-pointer"
      onClick={onClick}
    >
      <CardActionArea className="p-4 flex flex-col items-center justify-center">
        <div className="w-52 h-52 mx-10 my-5 rounded-full overflow-hidden">
          <img alt={Name} src={profile} className="w-full h-full object-cover" />
        </div>
        <Typography variant="h6" className="text-center font-semibold">
          {Name}
        </Typography>
        <Typography variant="body2" className="text-center text-gray-500">
          B.Tech {PassedOutYear}, {Department}
        </Typography>
      </CardActionArea>
    </Card>
  );
};

const AlumniList = () => {
  const loading = useContext(LoadingContext);
  const [Alumnis, setAlumnis] = useState<Alumniforcard[]>([]);
  const [filteredAlumnis, setFilteredAlumnis] = useState<Alumniforcard[]>([]);
  const [nameSearch, setNameSearch] = useState('');
  const [departmentSearch, setDepartmentSearch] = useState('');
  const [yearSearch, setYearSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlumni = async () => {
      loading?.showLoading(true);
      try {
        const response = await axios.get('/api/alumni/getalumniscards', {
          withCredentials: true,
        });
        setAlumnis(response.data.alumnis);
        setFilteredAlumnis(response.data.alumnis); // Initially show all
      } catch (error) {
        console.error('Error fetching alumni data', error);
      }
      loading?.showLoading(false);
    };
    fetchAlumni();
  }, []);

  const handleSearch = () => {
    const filtered = Alumnis.filter(alumni =>
      alumni.Name.toLowerCase().includes(nameSearch.toLowerCase()) &&
      alumni.Department.toLowerCase().includes(departmentSearch.toLowerCase()) &&
      (!yearSearch || alumni.PassedOutYear.toString().startsWith(yearSearch))
    );
    setNameSearch('');
    setDepartmentSearch('');
      setYearSearch('');
    setFilteredAlumnis(filtered);
  };

  const handleShowAll = () => {
    setNameSearch('');
    setDepartmentSearch('');
    setYearSearch('');
    setFilteredAlumnis(Alumnis); // Reset to show all
  };

  const handleCardClick = (id: number) => {
    navigate(`/alumni/friends/${id}`);
  };

  return (
    <Container maxWidth="xl" className="m-10 mx-auto p-6 bg-gray-50 ">
    <div className='sm:flex h-screen p-4'>
      {/* Left Sidebar - Search */}
      <div className='sm:w-1/4 p-4'>
     
        <h3 className="font-bold mb-4">FILTER ALUMNI</h3>

        {/* Search by Name */}
        <div className="relative w-full mb-4">
          <input
            type="text"
            placeholder="Search by Name..."
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
            className="w-full border border-gray-300 p-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Search by Department */}
        <div className="relative w-full mb-4">
          <input
            type="text"
            placeholder="Search by Department..."
            value={departmentSearch}
            onChange={(e) => setDepartmentSearch(e.target.value)}
            className="w-full border border-gray-300 p-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Search by PassedOutYear */}
        <div className="relative w-full mb-4">
          <input
            type="number"
            placeholder="Search by Year (YYYY)..."
            value={yearSearch}
            onChange={(e) => setYearSearch(e.target.value)}
            className="w-full border border-gray-300 p-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            min="2000"
            maxLength={4}
          />
        </div>

        <button onClick={handleSearch} className="w-full bg-indigo-500 text-white p-2 rounded-lg">
          <SearchIcon /> Search
        </button>

        <div className=' pt-5'>
      <button onClick={handleShowAll} className="w-full bg-indigo-500 text-white p-2 rounded-lg ">
          Show All Alumni
        </button></div>
      </div>

      {/* Main Content - Alumni Cards */}
      <div className='sm:w-3/4'>
        <Container className="m-10 mx-auto p-6 border  rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {filteredAlumnis.length > 0 ? (
              filteredAlumnis.map((alumni, index) => (
                <AlumniCard
                  key={index}
                  profile={alumni.profile}
                  Name={alumni.Name}
                  Department={alumni.Department}
                  PassedOutYear={alumni.PassedOutYear}
                  onClick={() => handleCardClick(alumni.id)}
                />
              ))
            ) : (
              <Typography variant="h6" className="text-center col-span-full">
                No alumni found.
              </Typography>
            )}
          </div>
        </Container>
      </div>
    </div>
    </Container>
  );
};

export default AlumniList;
