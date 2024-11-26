
import React, { useContext, useState } from 'react';
import { TextField,  Button,   FormControlLabel, Radio, RadioGroup, Checkbox, Container, Typography } from '@mui/material';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'tailwindcss/tailwind.css';
import RichTextEditor from '../components/Custom/RichTextEditor';
import axios from 'axios';
import { AlertDialogContext } from '../components/Contex/AlertDialogProvider';
import { LoadingContext } from '../components/Contex/Loding';
const AddJob: React.FC = () => {
  const [step, setStep] = useState(1);
  const loading=useContext(LoadingContext);
  const [formData, setFormData] = useState({
    jobType: 'Job',
    jobTitle: '',
    companyName: '',
    location: '',
    salary: '',
    stipend: '',
    deadline: new Date(),
    workFromHome: false,
    duration: '',
    startDate: new Date(),
    websiteUrl: '',
    roleInfo:'',
    companyInfo:''
  });
  const [errors, setErrors] = useState<any>({});
const [roleInfo,setRoleInfo]=useState<string>('');
const [companyInfo,setCompanyInfo]=useState<string>('');
const alertDialog = useContext(AlertDialogContext);
  
  const prevStep = () => setStep(step - 1);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value, type, checked } = event.target as HTMLInputElement;
    setFormData(prevState => ({
      ...prevState,
      [name!]: type === 'checkbox' ? checked : value
    }));
  };
  
  const formErrors: any = {};
  const validatetwonextStep=()=>{
    if(!formData.websiteUrl) formErrors.websiteUrl='enter the URL';
    setErrors(formErrors);
    if(Object.keys(formErrors).length === 0)  setStep(step + 1);

  }
 
  const validateoneNext = () => {
    
    const now = new Date();
    if (!formData.companyName) formErrors.companyName = 'Company name is required';
    if (!formData.jobTitle) formErrors.jobTitle = 'Job title is required';
   // if (!formData.location) formErrors.location = 'Location is required';
    if (formData.deadline < now) formErrors.deadline = 'Deadline must be in the future';
    if((!formData.workFromHome)&&(!formData.location)) formErrors.location='location is required'
    if(formData.jobType==='Internship'){
      if(!formData.duration) formErrors.duration='duration is required';
      if(formData.startDate <= formData.deadline) formErrors.startDate='start date should be after deadline';
      if(!formData.stipend) formErrors.stipend='date is required';
    }else{
      if (!formData.salary) formErrors.salary = 'Salary is required';
    }
    setErrors(formErrors);
    if(Object.keys(formErrors).length === 0)  setStep(step + 1);
  };

  const handleDeadlineChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = event.target.value;
    const date = new Date(dateString);
    const now = new Date();
    
    if (date < now) {
      setErrors({ ...errors, deadline: 'Deadline cannot be in the past' });
    } else {
      setErrors({ ...errors, deadline: '' });
      setFormData({ ...formData, deadline: date });
    }
  };
  const handlestartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateString = event.target.value;
    const date = new Date(dateString);
    const now = new Date();
    
    if (date < now) {
      setErrors({ ...errors, startDate: 'startDate cannot be in the past' });
    } else {
      setErrors({ ...errors, startDate: '' });
      setFormData({ ...formData, startDate: date });
    }
  };

  // const handleEditorChange = (field: 'companyInfo' | 'roleInfo', editorState: EditorState) => {
  //   setFormData(prevState => ({ ...prevState, [field]: editorState }));
  // };

  const handleSubmit = async() => {
    loading?.showLoading(true,"fetching data,please wait...");
      console.log("Form submitted with data: ", formData);
      const formattedJobData = {
        ...formData,
        companyInfo:companyInfo,
        roleInfo:roleInfo
      };
      console.log(formattedJobData);
      try {
              const response = await axios.post('/api/jobs/add', formattedJobData, {
                headers: {
                  'Content-Type': 'application/json',
                },
                withCredentials: true, // Ensures cookies are sent with the request
              });
        
              if (response.data.goahead) {
                loading?.showLoading(false);
                alertDialog?.showAlertDialog(
                  "Reminder!!",
                  "Job post will be updated in jobs page after admin approves it",
                  () => {
                    window.location.reload(true);
                  }
                );
              } else {
                console.log(response.data.message);
              }
            } catch (error) {
              console.error('Error:', error);
              alert('Error adding job.');
            }
      // Add form submission logic here
  };

  return (
    <div className="container mx-auto p-6">
    <Container maxWidth="md" className="m-10 mx-auto p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
      {step === 1 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Post an Opportunity (Step 1 of 3)</h2>
          <RadioGroup
            row
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
          ><Typography variant='h6' >post a  &nbsp;</Typography>
            <FormControlLabel value="Job" control={<Radio />} label="Job" />
            <FormControlLabel value="Internship" control={<Radio />} label="Internship" />
          </RadioGroup>
          <TextField
            label="Job Title"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            fullWidth
            className="mb-10"
            sx={{marginY:2}}
            error={!!errors.jobTitle}
            helperText={errors.jobTitle}
          />
          <TextField
            label="Name of the Company"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            fullWidth
            className="mb-4"
            sx={{marginY:2}}
            error={!!errors.companyName}
            helperText={errors.companyName}
          /><div className='flex flex-row justify-between items-center'>
          <div className='flex-1'>
            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              fullWidth
              className="mb-4"
              sx={{ marginY: 2 }}
              error={!!errors.location}
              helperText={errors.location}
              disabled={formData.workFromHome} // Disable when checkbox is checked
            />
          </div>
          <div className='flex-1 flex items-center space-x-5 ml-10'>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={formData.workFromHome} 
                  onChange={handleChange} 
                  name="workFromHome" 
                />
              }
              label="Work from home"
            />
          </div>
        </div>
        
          <TextField
            label="Deadline to Apply"
            name="deadline"
            type="date"
            value={formData.deadline.toISOString().split('T')[0]} // Format date as YYYY-MM-DD
            onChange={handleDeadlineChange}
            fullWidth
            margin="normal"
            sx={{marginY:2}}
            error={!!errors.deadline}
            helperText={errors.deadline}
            InputLabelProps={{ shrink: true }}
          />
          {formData.jobType === 'Internship' ? (
            <>
              <TextField
                label="Stipend"
                name="stipend"
                value={formData.stipend}
                onChange={handleChange}
                fullWidth
                className="mb-4"
                sx={{marginY:2}}
                error={!!errors.stipend}
              helperText={errors.stipend}
              />
              <TextField
                label="Duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                fullWidth
                sx={{marginY:2}}
                className="mb-4"
                error={!!errors.duration}
              helperText={errors.duration}
              />
              <TextField
                label="Start Date of internship"
                name="startDate"
                value={formData.startDate.toISOString().split('T')[0]}
                onChange={handlestartDateChange}
                fullWidth
                className="mb-4"
                sx={{marginY:2}}
                type="date"
                InputLabelProps={{ shrink: true }}
                error={!!errors.startDate}
              helperText={errors.startDate}
              />
            </>
          ) : (
            <TextField
              label="Salary"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              fullWidth
              className="mb-4"
              sx={{marginY:2}}
              error={!!errors.salary}
              helperText={errors.salary}
            />
          )}
          <div className="flex justify-between">
            <Button variant="contained" color="primary" onClick={validateoneNext}>Next</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Post an Opportunity (Step 2 of 3)</h2>
            <TextField
              label="External link(to apply)"
              name="websiteUrl"
              value={formData.websiteUrl}
              onChange={handleChange}
              fullWidth
              className="mb-4"
              sx={{marginY:3}}
              error={!!errors.websiteUrl}
              helperText={errors.websiteUrl}
            />
          <div className="flex justify-between mt-7">
            <Button variant="contained" color="secondary" onClick={prevStep}>Back</Button>
            <Button variant="contained" color="primary" onClick={validatetwonextStep}>Next</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Post an Opportunity (Step 3 of 3)</h2>
          <div className="mb-4">
            <h3 className="text-lg text-red-600 my-2">write about Company*</h3>
            <RichTextEditor value={companyInfo} onChange={setCompanyInfo} sourcePage='' />
          </div>
          <br></br>
          <div className="mt-5 mb-4">
            <h3 className="text-lg text-red-600">write about role,responsibility,eligibility etc.*</h3>
            <RichTextEditor value={roleInfo} onChange={setRoleInfo} sourcePage='' />
          </div>
          <div className="flex justify-between">
            <Button variant='contained' color="secondary" sx={{marginY:2}} onClick={prevStep}>Back</Button>
            <Button variant="contained" color="primary" sx={{marginY:2}} onClick={handleSubmit}>Submit</Button>
          </div>
        </div>
      )}
      </Container>
    </div>
  );
};

export default AddJob;
