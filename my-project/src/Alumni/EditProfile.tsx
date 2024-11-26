import React, { useEffect, useState } from 'react';
import { TextField, Button, Avatar, IconButton } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import axios from 'axios'; // Assuming you use axios for API requests

interface ProfileData {
  name: string;
  collegeName: string;
  degree: string;
  birthdate: string;
  relationshipStatus: string;
  experience: string;
  skills: string;
  contactNo: string;
  email: string;
  avatarUrl: string;
}

const EditProfile = () => {
  const { register, handleSubmit, setValue } = useForm();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const [editProfessional, setEditProfessional] = useState(false);
  const [editEducation, setEditEducation] = useState(false);
  const [editPersonal, setEditPersonal] = useState(false);
  const [editContact, setEditContact] = useState(false);

  // Fetch user profile data from the backend
  useEffect(() => {
    axios.get('/api/profile/123') // Fetch data from the backend API
      .then(response => {
        const data = response.data;
        setProfileData(data);

        // Pre-fill form fields with data (if already filled)
        setValue('experience', data.experience !== '-' ? data.experience : '');
        setValue('skills', data.skills !== '-' ? data.skills : '');
        setValue('collegeName', data.collegeName !== '-' ? data.collegeName : '');
        setValue('degree', data.degree !== '-' ? data.degree : '');
        setValue('birthdate', data.birthdate !== '-' ? data.birthdate : '');
        setValue('relationshipStatus', data.relationshipStatus !== '-' ? data.relationshipStatus : '');
        setValue('contactNo', data.contactNo !== '-' ? data.contactNo : '');
        setValue('email', data.email !== '-' ? data.email : '');
      })
      .catch(error => {
        console.error('Error fetching profile data:', error);
      });
  }, [setValue]);

  const onSubmit = (data: any) => {
    console.log('Updated data:', data);
    // Send updated data to the backend server
    axios.post('/api/profile/update', data)
      .then(response => {
        console.log('Profile updated successfully');
      })
      .catch(error => {
        console.error('Error updating profile:', error);
      });
  };

  if (!profileData) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  return (
    <div className="p-6 bg-gray-100">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Avatar
          src={profileData.avatarUrl || '/path-to-avatar.jpg'}
          sx={{ width: 64, height: 64 }}
          alt="Profile"
        />
        <div>
          <h1 className="text-2xl font-bold">{profileData.name}</h1>
          <p className="text-gray-500">{profileData.degree !== '-' ? `${profileData.degree}` : 'Degree not provided'}</p>
        </div>
        <Button variant="contained" className="bg-yellow-500">Edit Profile</Button>
      </div>

      {/* Professional Details */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Professional Details</h2>
          <IconButton onClick={() => setEditProfessional(!editProfessional)}>
            <Edit />
          </IconButton>
        </div>
        {editProfessional ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField {...register("experience")} label="Experience" fullWidth variant="outlined" className="mt-2" />
            <TextField {...register("skills")} label="Skills" fullWidth variant="outlined" className="mt-2" />
            <Button type="submit" variant="contained" className="bg-green-500 mt-4">Save</Button>
          </form>
        ) : (
          <div>
            <p>Experience: {profileData.experience !== '-' ? profileData.experience : 'Not provided'}</p>
            <p>Professional Skills: {profileData.skills !== '-' ? profileData.skills : 'Not provided'}</p>
          </div>
        )}
      </div>

      {/* Education Details */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Education Details</h2>
          <IconButton onClick={() => setEditEducation(!editEducation)}>
            <Edit />
          </IconButton>
        </div>
        {editEducation ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField {...register("collegeName")} label="College Name" fullWidth variant="outlined" className="mt-2" />
            <TextField {...register("degree")} label="Degree" fullWidth variant="outlined" className="mt-2" />
            <Button type="submit" variant="contained" className="bg-green-500 mt-4">Save</Button>
          </form>
        ) : (
          <div>
            <p>College: {profileData.collegeName !== '-' ? profileData.collegeName : 'Not provided'}</p>
            <p>Degree: {profileData.degree !== '-' ? profileData.degree : 'Not provided'}</p>
          </div>
        )}
      </div>

      {/* Personal Information */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <IconButton onClick={() => setEditPersonal(!editPersonal)}>
            <Edit />
          </IconButton>
        </div>
        {editPersonal ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField {...register("birthdate")} label="Birthdate" fullWidth variant="outlined" className="mt-2" />
            <TextField {...register("relationshipStatus")} label="Relationship Status" fullWidth variant="outlined" className="mt-2" />
            <Button type="submit" variant="contained" className="bg-green-500 mt-4">Save</Button>
          </form>
        ) : (
          <div>
            <p>Birthdate: {profileData.birthdate !== '-' ? profileData.birthdate : 'Not provided'}</p>
            <p>Relationship Status: {profileData.relationshipStatus !== '-' ? profileData.relationshipStatus : 'Not provided'}</p>
          </div>
        )}
      </div>

      {/* Contact Details */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Contact Details</h2>
          <IconButton onClick={() => setEditContact(!editContact)}>
            <Edit />
          </IconButton>
        </div>
        {editContact ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField {...register("contactNo")} label="Contact No." fullWidth variant="outlined" className="mt-2" />
            <TextField {...register("email")} label="Email" fullWidth variant="outlined" className="mt-2" />
            <Button type="submit" variant="contained" className="bg-green-500 mt-4">Save</Button>
          </form>
        ) : (
          <div>
            <p>Contact No: {profileData.contactNo !== '-' ? profileData.contactNo : 'Not provided'}</p>
            <p>Email: {profileData.email !== '-' ? profileData.email : 'Not provided'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProfile;
