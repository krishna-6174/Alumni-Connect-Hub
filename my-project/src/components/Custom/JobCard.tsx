import React from 'react';
import { Button, Avatar } from '@mui/material';
import clsx from 'clsx';
// import ViewJob from '../../Alumni/ViewJob';
// import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// Helper function to format dates to "MMM DD, YYYY"
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
};

// Helper function to check if the deadline has passed
const isDeadlinePassed = (deadline: string) => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  return deadlineDate < today;
};

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
  role: 'admin' | 'alumni'; // Role added here
  user_name: string;
  user_avatar: string; // The user profile image URL
}

const JobCard: React.FC<Job> = ({
  id,
  job_type,
  job_title,
  company_name,
  location,
  salary,
  stipend,
  deadline,
  posted_date,
  user_name,
  user_avatar,
  role, // Role passed in here
}) => {
  const isInternship = job_type === 'Internship';
  const viewButtonText = isInternship ? 'View Internship Post' : 'View Job Post';
  const navigate = useNavigate();
  const handleViewClick = async() => {
  //   console.log(`Viewing ${id}: ${job_title} at ${company_name}`);
  //   const response = await axios.get(`http://localhost:6969/jobs/${id}`, {
  //     withCredentials: true,
  //   });
  //   console.log(response.data.job);
  //    <ViewJob jobData={response.data.job}/>


  navigate(`/alumni/jobs/${id}`)
  }
  // Check if the job is closed (deadline passed)
  const jobClosed = isDeadlinePassed(deadline);

  return (
    <div className="border rounded-lg p-4 shadow-md bg-white">
      <div className="flex justify-between relative">
        {/* Left section: Job title, company, location, and deadline */}
        <div>
          <span className="text-lg font-serif font-semibold">{job_title}{' '}</span>
          | <span>{company_name}</span>
          <br />
          <div className="text-sm text-gray-700 font-serif">
            <p>Location: {location}</p>
            <p>Deadline: {formatDate(deadline)}</p>
            <p>{isInternship ? `Stipend: ${stipend || 'Not Provided'}` : `Salary: ${salary || 'Market'}`}</p>
          </div>
        </div>

        {/* Right section: Job type badge with closed status if applicable */}
        <div className="flex flex-row items-end space-x-2 absolute top-5 right-5">
          {jobClosed && (
            <span className="px-2 py-1 rounded-lg text-xs font-semibold mb-2 bg-red-600 text-white">
              Closed
            </span>
          )}
          <span
            className={clsx(
              'px-2 py-1 rounded-lg text-xs font-semibold mb-2',
              isInternship ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
            )}
          >
            {job_type}
          </span>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        {/* Middle section: User avatar and info */}
        <div className="flex items-center">
          <Avatar alt={user_name} src={user_avatar} sx={{ width: 40, height: 40 }} />
          <div className="ml-2">
            <p className="text-sm font-semibold">{user_name}</p>
            <p className="text-xs text-gray-500">Published on {formatDate(posted_date)}</p>
          </div>

          {/* Role badge */}
          <span
            className={clsx(
              'ml-4 px-2 py-1 rounded-lg text-xs font-semibold',
              role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
            )}
          >
            {role === 'admin' ? 'Admin' : 'Alumni'}
          </span>
        </div>

        {/* Right section: View Job/Internship Button */}
        <div className="flex items-center space-x-1">
          <Button variant="outlined" size="small" color="primary" onClick={handleViewClick} className="mt-2">
            {viewButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
