import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box, Container } from '@mui/material';
import {Delete, Visibility, Person } from '@mui/icons-material';
import { ApproveDialogContext } from '../components/Contex/ApproveDialogProvider';
import { LoadingContext } from '../components/Contex/Loding';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
interface Job {
  id: number;
  jobTitle: string;
  companyName: string;
  location: string;
  jobType: string;
  deadline: string;
  user_id:number;
  role:string;
  status:string;
}

const ManageJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [approvalStatus, setApprovalStatus] = useState<boolean[]>([]);
  const { showApproveDialog } = useContext(ApproveDialogContext);
  const loading=useContext(LoadingContext);
  useEffect(() => {
    loading?.showLoading(true);
    async function fetch() {
      await axios.get('/api/admin/activejobs', {
        withCredentials: true // Ensures cookies are sent with the request
      })
      .then(response => {
        console.log(response.data.jobs);
  
        // Map the jobs data to match the structure of the object provided
        const mappedJobs = response.data.jobs.map((job: any) => ({
          id: job.id,
          jobType: job.job_type,            // Match job_type
          jobTitle: job.job_title,          // Match job_title
          companyName: job.company_name,    // Match company_name
          location: job.location,           // Match location
          deadline: job.deadline,            // Match salary
          user_id: job.user_id,              // Match user_id
          role: job.role                    // Match role (not used before but included now)
        }));
  
        setJobs(mappedJobs);                // Set mapped jobs to state
        console.log(mappedJobs);            // Log the mapped jobs
        setApprovalStatus(new Array(mappedJobs.length).fill(false)); // Initialize approval statuses
      })
      .catch(error => {
        console.log('There was an error fetching the jobs!', error);
      });
      loading?.showLoading(false);
    }
  
    fetch();
  }, []);
  

  const handleView = async (index:number,id: number) => {
    loading?.showLoading(true);
    const response = await axios.get(`/api/jobs/${id}`, {
      withCredentials: true,
    });
    console.log(response.data.job);
    loading?.showLoading(false);
    showApproveDialog(response.data.job, async () => {
    },"Approved Job Data");
  };

  const handlePostedBy = async(id: number) => {
    loading?.showLoading(true);
    console.log(id)
    try{
      const response=await axios.get(`/api/admin/alumni/${id}`,{
        withCredentials:true,
      });
      console.log(response.data);
      showApproveDialog(response.data.alumni, async () => {
        console.log("jhsv svdyjh");
      },"JobAlumni");
    }catch(error){
      console.log("error",error);
    }
    console.log(id);
   loading?.showLoading(false);
  };

  const handleDelete = async(id: number) => {
    loading?.showLoading(true);
    console.log('Delete job:', id);
    try{
    const response=await axios.delete(`/api/deletejob/${id}`, {
      withCredentials: true
    });
    console.log(response.data);
    if(response.data.status){
      setJobs(jobs.filter(job => job.id !== id));
    }
  }
   catch(error){
      console.log('There was an error deleting the job!', error);
    };
    loading?.showLoading(false);  }

  return (
    <div className='m-5'>
      <Container maxWidth="xl" className="m-10 mx-auto p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
        {jobs.length===0?(<Typography variant='h4'>There are  no new jobs posted by Alumni's</Typography>):(
        <Box sx={{ background: 'white' }}>
          <Typography variant="h4" gutterBottom>
            Job Details
          </Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'blue' }}>
                  <TableCell sx={{ border: '1px solid #ddd', color: 'white', fontSize: 20 }}>S.No</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', color: 'white', fontSize: 20 }}>Job Title</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', color: 'white', fontSize: 20 }}>Company Name</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', color: 'white', fontSize: 20 }}>Job Location</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', color: 'white', fontSize: 20 }}>Job Type</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', color: 'white', fontSize: 20 }}>Deadline</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', color: 'white', fontSize: 20 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.map((job, index) => (
                  <TableRow key={job.id}>
                    <TableCell sx={{ border: '1px solid #ddd', fontSize: 18 }}>{index + 1}</TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', fontSize: 18 }}>{job.jobTitle}</TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', fontSize: 18 }}>{job.companyName}</TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', fontSize: 18 }}>{job.location}</TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', fontSize: 18 }}>{job.jobType}</TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', fontSize: 18 }}>{job.deadline}</TableCell>
                    <TableCell sx={{ border: '1px solid #ddd' }}>
                      <div className="flex space-x-2">
                        <Button
                          variant="contained"
                          color={approvalStatus[index] ? 'success' : 'primary'}
                          startIcon={approvalStatus[index] ? <CheckCircleIcon /> : <Visibility />}
                          onClick={() => {
                            if (!approvalStatus[index]) {
                              handleView(index, job.id); // Call handleView if not approved yet
                            }
                          }}
                          className={approvalStatus[index] ? "bg-green-500 hover:bg-green-700" : "bg-blue-500 hover:bg-blue-700"}
                        >
                           {approvalStatus[index] ? 'Approved' : 'View'}
                        </Button>
                        <Button
                          variant="contained"
                          color="info"
                          startIcon={<Person />}
                          onClick={() => handlePostedBy(job.user_id)}
                          className="bg-teal-500 hover:bg-teal-700"
                        >
                          Posted By
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => handleDelete(job.id)}
                          className="bg-red-500 hover:bg-red-700"
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>)}
      </Container>
    </div>
  );
};

export default ManageJobs;
