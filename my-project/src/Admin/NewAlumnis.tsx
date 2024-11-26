import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Box, Container } from '@mui/material';
import { Delete, Visibility } from '@mui/icons-material';
import { ApproveDialogContext } from '../components/Contex/ApproveDialogProvider';
import { Alumni } from '../types';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { LoadingContext } from '../components/Contex/Loding';
const NewAlumnis: React.FC = () => {
  const [alumnis, setAlumnis] = useState<Alumni[]>([]);
  const [approvalStatus, setApprovalStatus] = useState<boolean[]>([]); // Array to track approval status
  const  {showApproveDialog } = useContext(ApproveDialogContext);
const loading=useContext(LoadingContext);
  useEffect(() => {
    // Fetch alumnis from the backend
    async function fetchAlumnis() {
      loading?.showLoading(true);
      try {
        
        const response = await axios.get('/api/admin/getalumnis', {
          withCredentials: true
        });
        const mappedAlumnis = response.data.alumnis.map((Alumni: any) => ({
          id: Alumni.id,
          fullName: Alumni.name,
          rollNo: Alumni.Rollno,
          email: Alumni.email,
          department: Alumni.dept,
          passedOutYear: Alumni.poy,
          status: Alumni.status
        }));

        setAlumnis(mappedAlumnis);
        console.log(alumnis);
        setApprovalStatus(new Array(mappedAlumnis.length).fill(false)); // Initialize the approval status array
      } catch (error) {
        console.log('There was an error fetching the alumni data!', error);
      }
      loading?.showLoading(false);
    }
    fetchAlumnis();
  }, []);

  const handleView = async (index: number, id: number) => {
    const response = await axios.get(`/api/admin/alumni/${id}`, {
      withCredentials: true,
    });
    console.log(response.data);
    showApproveDialog(response.data.alumni, async () => {
      loading?.showLoading(true);
      try {
        const response = await axios.patch(`/api/admin/updatealumni/${id}`, {}, {
          withCredentials: true, // Include credentials if needed (cookies, etc.)
        });
        console.log('Status updated:', response.data.message);
        // Update the approval status for the specific index
        const updatedStatus = [...approvalStatus];
        updatedStatus[index] = true;
        setApprovalStatus(updatedStatus); // Update the state
      } catch (err) {
        console.log('Error updating status:', err);
      }
      loading?.showLoading(false);
    },"Alumni Data");
  };

  const handleDelete = async (id: number) => {
    loading?.showLoading(true);
    try {
      const response = await axios.delete(`/api/admin/deletealumni/${id}`, {
        withCredentials: true, // Include credentials if needed
      });
      console.log('Record deleted:', response.data);
      
      // Optionally, remove the deleted alumni from the local state to reflect UI changes
      setAlumnis((prevAlumnis) => prevAlumnis.filter((alumni) => alumni.id !== id));
      
    } catch (err) {
      console.error('Error deleting record:', err);
    }
    loading?.showLoading(false);
  };

  return (
    <div className='m-5'>
      <Container maxWidth="xl" className="m-10 p-5 mx-auto border border-gray-300 rounded-lg shadow-lg bg-white">
      {alumnis.length === 0 ? (
  <Typography variant='h4'>There are no new alumni registrations.</Typography>
) : (
  <Box sx={{ background: 'white' }}>
          <Typography variant="h4" gutterBottom>
            Alumni Details
          </Typography>
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: 'blue' }}>
                  <TableCell sx={{ border: '1px solid #ddd', color: 'white', fontSize: 20 }}>S.No</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', color: 'white', fontSize: 20 }}>Full Name</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', color: 'white', fontSize: 20 }}>Roll No</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', color: 'white', fontSize: 20 }}>Email</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', color: 'white', fontSize: 20 }}>Department</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', color: 'white', fontSize: 20 }}>Passed Out Year</TableCell>
                  <TableCell sx={{ border: '1px solid #ddd', color: 'white', fontSize: 20 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {alumnis.map((alumni, index) => (
                  <TableRow key={alumni.id}>
                    <TableCell sx={{ border: '1px solid #ddd', fontSize: 18 }}>{index + 1}</TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', fontSize: 18 }}>{alumni.fullName}</TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', fontSize: 18 }}>{alumni.rollNo}</TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', fontSize: 18 }}>{alumni.email}</TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', fontSize: 18 }}>{alumni.department}</TableCell>
                    <TableCell sx={{ border: '1px solid #ddd', fontSize: 18 }}>{alumni.passedOutYear}</TableCell>
                    <TableCell sx={{ border: '1px solid #ddd' }}>
                      <div className="flex space-x-2">
                        <Button
                          variant="contained"
                          color={approvalStatus[index] ? 'success' : 'primary'}
                          startIcon={approvalStatus[index] ? <CheckCircleIcon /> : <Visibility />}
                          onClick={() => {
                            if (!approvalStatus[index]) {
                              handleView(index, alumni.id); // Call handleView if not approved yet
                            }
                          }}
                          className={approvalStatus[index] ? "bg-green-500 hover:bg-green-700" : "bg-blue-500 hover:bg-blue-700"}
                        >
                          {approvalStatus[index] ? 'Approved' : 'View'}
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          startIcon={<Delete />}
                          onClick={() => handleDelete(alumni.id)}
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

export default NewAlumnis;
