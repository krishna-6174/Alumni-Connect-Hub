// import React, { useContext, useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom'; // To get the alumni ID from the URL
// import axios from 'axios';
// import { LoadingContext } from '../components/Contex/Loding';
// interface AlumniDetail {
//   id: number;
//   Name: string;
//   profile: string | null;
//   Department: string;
//   PassedOutYear: number;
//   Bio: string; // Add any other properties as needed
// }

// const AlumniDetailPage = () => {
//   const { id } = useParams(); // Get the alumni ID from the URL
//   const [alumni, setAlumni] = useState<AlumniDetail | null>(null);
// const loading=useContext(LoadingContext);
//   useEffect(() => {
//     loading?.showLoading(true);
//     async function fetchAlumniDetail() {
//       try {
//         const response = await axios.get(`/api/admin/alumni/${id}`, {
//           withCredentials: true
//         });
//         setAlumni(response.data.alumni);
//       } catch (error) {
//         console.log("Error fetching alumni details:", error);
//       }
//       loading?.showLoading(false);
//     }
//     fetchAlumniDetail();
//   }, [id]);

//   if (!alumni) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="alumni-detail-page">
//       <h1>{alumni.Name}</h1>
//       <img src={alumni.profile} alt={alumni.Name} />
//       <p>Department: {alumni.Department}</p>
//       <p>Passed Out Year: {alumni.PassedOutYear}</p>
//       <p>Bio: {alumni.Bio}</p>
//       {/* Add any other data you want to display */}
//     </div>
//   );
// };

// export default AlumniDetailPage;
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ViewAlumni = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [alumni, setAlumni] = useState(); // State to hold the alumni data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // Fetch the alumni data from the backend using the id
    const fetchAlumniData = async () => {
      try {
        const response = await axios.get(`/api/admin/alumni/${id}`,{withCredentials:true});
        setAlumni(response.data.alumni);
        console.log("data ",response.data.alumni)
        setLoading(false);
      } catch (err) {
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchAlumniData();
  }, [id]); // Dependency array with id

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  if (!alumni) return <p>No alumni data found</p>;

  // Destructure alumni object
  console.log("alumni ",alumni);
  const { 
    profile, 
    Name, 
    Gender, 
    Rollno, 
    Mobile, 
    Email, 
    address, 
    Department, 
    PassedOutYear, 
    job_status, 
    interest, 
    companyname, 
    Location, 
    Job_role, 
    Portfolio, 
    linkedIn, 
    myself 
  } = alumni;
  

  return (
    <div className="container mx-auto p-6">
      {/* User Info Section */}
      <div className="flex items-center">
        <img
          src={profile || '/default-profile.png'}
          alt="Profile"
          className="w-48 h-48 rounded-md border-2"
        />
        <div className="ml-6">
          <h1 className="text-2xl font-bold">{Name}</h1>
          <p className="text-gray-600">B.Tech { Department},{PassedOutYear}</p>
        </div>
      </div>

      {/* Details Section */}
      <div className="mt-8 space-y-4">
        <div className="bg-white shadow-md p-4 rounded">
          <h2 className="text-xl font-semibold">Professional Details</h2>
          <p>Job Staus : {job_status || 'Work profile is incomplete'}</p>
          <p>Interest : {interest || 'Not provided'}</p>
          <p>Company Name: {companyname|| 'Not provided'}</p>
          <p>Job Role: {Job_role || 'Not provided'}</p>
          <p>Job Location: {Location || 'Not provided'}</p>
        </div>

        <div className="bg-white shadow-md p-4 rounded">
          <h2 className="text-xl font-semibold">Education Details</h2>
          <p>Department : {Department || 'Not provided'}</p>
          <p>Passed Out Year:  ({PassedOutYear || 'Not provided'})</p>
        </div>

        <div className="bg-white shadow-md p-4 rounded">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <p>Gender : {Gender || 'Not provided'}</p>
          <p>About me: {myself || 'Not provided'}</p>
          <p>Email : {Email || 'Not provided'}</p>
          <p>Contact No: {Mobile|| 'Not provided'}</p>
          <p>LinkedIn: {linkedIn || 'Not provided'}</p>
          <p>Address: {address || 'Not provided'}</p>
        </div>
      </div>
    </div>
  );
};

export default ViewAlumni;

