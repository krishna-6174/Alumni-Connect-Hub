import { useContext, useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Chip, Typography, Paper, Box, Container } from '@mui/material';
import { LocationOn, DateRange } from '@mui/icons-material';
import { LoadingContext } from '../components/Contex/Loding';
import { Event } from '@mui/icons-material';
import './ViewJob.css';
import QuillEditor from "../components/Editor/QuillEditor";
const ViewJob = () => {
  const { id } = useParams();  // Get the job ID from the URL
  const [jobData, setJobData] = useState<Job | null>(null);
  const loading = useContext(LoadingContext);
  const [error, setError] = useState('');
  // Fetch job data when component mounts
  useEffect(() => {
    loading?.showLoading(true, "loading...");
    const fetchJobData = async () => {
      try {
        const response = await axios.get(`/api/jobs/${id}`, {
          withCredentials: true,
        });
        setJobData(response.data.job);
        loading?.showLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load job data');
        loading?.showLoading(false);
      }
    };

    fetchJobData();
  }, [id]);

  if (error) {
    return (
      <Box className="p-6">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  if (!jobData) {
    return (
      <Box className="p-6">
        <Typography variant="h6">
          No job data available.
        </Typography>
      </Box>
    );
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  };

  const isDeadlinePassed = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    return deadlineDate < today;
  };

  const jobClosed = isDeadlinePassed(jobData.deadline as string);
  const isJob = jobData.job_type === 'Job';  // Determines if it's a job or internship

  return (
    <div className='bg-slate-100'>
      <Container maxWidth="md" className="m-10 mx-auto p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
        <Paper elevation={0} className="">
          {/* Heading Section */}
          <Box>
            <Typography variant="h4" className="font-bold">
              {jobData.job_title}
            </Typography>
            <Typography variant="h6" color="textSecondary">
              {jobData.company_name}
            </Typography>
            <Box className="flex items-center space-x-2 m-2">
              <LocationOn className="text-gray-500" />
              <div className='font-medium'>{jobData.location}</div>
            </Box>
          </Box>

          {/* Status and Apply Button */}
          <Box
            className="flex justify-between items-start"
            sx={{
              flexDirection: { xs: 'column', sm: 'column', md: 'row' }, // Row for large screens, column for small
              gap: { xs: 2, sm: 2, md: 0 }, // Add space between elements for small screens
            }}
          >
            <Box
              className="flex "
              sx={{
                justifyContent: { xs: 'start', sm: 'start', md: 'flex-start' }, // Center align for small screens
                flexDirection: { xs: 'column', sm: 'column', md: 'row' }, // Stack vertically for small screens
                alignItems: 'start', // Align items center in small screens
                gap: { xs: 2, sm: 2, md: 0 }, // Space between Chips
              }}
            >
              <Chip
                icon={<DateRange />}
                label={`Deadline: ${formatDate(jobData.deadline as string)}`}
                sx={{
                  color: 'blue', // Set the text color to blue
                  backgroundColor: '#e0f2ff', // Optional: Add background color if needed
                  fontWeight: 'medium', // Font weight similar to Tailwind's "font-medium"
                }}
              />
              <Chip
                icon={<Event />}
                label={`Posted Date: ${formatDate(jobData.posted_date as string)}`}
                sx={{
                  color: 'black', // Set the text color to blue
                  backgroundColor: '#e0f2ff', // Optional: Add background color if needed
                  fontWeight: 'medium', // Font weight similar to Tailwind's "font-medium"
                }}
              />
            </Box>

            <Button
              variant="contained"
              color={jobClosed ? "secondary" : "primary"}
              sx={{
                mt: { xs: 2, sm: 2, md: 0 }, // Add margin-top for small screens
                width: { xs: '40%', sm: '40%', md: 'auto' }, // Full width for small screens
              }}
              onClick={() => window.open(jobData.website_url as string, "_blank")}
              disabled={jobClosed}
            >
              Apply
            </Button>
          </Box>

          {/* Company Info with Quill */}
          <Box>
            <Typography variant="h6" className="font-bold mt-4">
              About {jobData.company_name}
            </Typography>
            <QuillEditor content={jobData.company_info as string} />
          </Box>

          {/* Job or Internship Details */}
          <div>
            <Typography variant="h6" className="font-bold">
              {isJob ? "Job Details" : "Internship Details"}
            </Typography>
            <div className="mt-4">
              <div className="font-bold">
                {isJob ? "Role Information" : "Internship Information"}
              </div>
              <QuillEditor content={jobData.role_info as string} />
            </div>
          </div>

          {/* Salary or Stipend */}
          {isJob ? (
            <Box className="flex space-x-4 mt-5">
              <div className='font-bold'>
                Salary:
              </div>
              <div>
                {jobData.salary || 'Not Disclosed'}
              </div>
            </Box>
          ) : (
            <Box className="flex space-x-4 mt-5">
              <div className='font-bold'>
                Stipend:
              </div>
              <div>
                {jobData.stipend || 'Not Disclosed'}
              </div>
              {jobData.duration && (
                <div className='flex space-x-4'>
                  <div className='font-bold'>
                    Duration:
                  </div>
                  <div>
                    {jobData.duration || 'Not Disclosed'}
                  </div>
                </div>
              )}
            </Box>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default ViewJob;
