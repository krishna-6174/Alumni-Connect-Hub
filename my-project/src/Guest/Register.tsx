import React, { useContext, useState } from 'react';
import { Button, TextField, Typography, Box, IconButton, InputAdornment, InputLabel, FormHelperText, RadioGroup, FormControlLabel, Radio, FormLabel, MenuItem, Select, Autocomplete } from '@mui/material';
import { Email, PhotoCamera, Visibility, VisibilityOff, Phone } from '@mui/icons-material';
import axios from 'axios';
import Mailcheck from 'mailcheck';
import { useNavigate } from 'react-router-dom';
import { AlertDialogContext } from "../components/Contex/AlertDialogProvider";
import { AlertContext } from '../components/Contex/AlertDetails';
import LockIcon from '@mui/icons-material/Lock';
import { LoadingContext } from "../components/Contex/Loding";
import LinkIcon from '@mui/icons-material/Link';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/CheckCircle'; // or use VerifiedIcon from @mui/icons-material/Verified
import { green } from '@mui/material/colors';

const Register: React.FC = () => {
  const loadingContext = useContext(LoadingContext);
  const [step, setStep] = useState(1);
  const alertDialog = useContext(AlertDialogContext);
  const alertContext = useContext(AlertContext);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isOtpSent, setIsOtpSent] = useState(false);
const [isOtpVerified, setIsOtpVerified] = useState(false);
const [otp, setOtp] = useState<string>('');
const [otpError, setOtpError] = useState<string>('');

  const [formData, setFormData] = useState({
    profileImg: null as File | null,
    firstName: '',
    lastName: '',
    gender: '',
    email: '',
    password: '',
    rollNo: '',
    department: '',
    yearOfPassing: '',
    status: '',
    companyName: '',
    role: '',
    location: '',
    interest: '',
    myself: '',
    contactNo: '',  // Added contact number
    address: '',
    portfolio:'' ,
    linkedIn:''  // Added address
  });

  const options = [
    'Software Development',
    'Web Development',
    'Mobile App Development',
    'Data Analysis',
    'Machine Learning',
    'Artificial Intelligence',
    'Cybersecurity',
    'Cloud Computing',
    'Database Management',
    'Networking',
    'Internet of Things (IoT)',
    'Project Management',
    'UX/UI Design',
    'DevOps',
    'Systems Analysis and Design',
    'Game Development',
    'Research and Development',
    'IT Consulting',
    'Other'
  ];
  

  interface FormErrors {
    [key: string]: string;
  }

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleNext = () => {
    if (step === 1) {
      if (validateInputs()) { // Ensure that the inputs are valid for the current stage
        setStep(step + 1);
      }
    } else if (step === 2) {
      if (validateInputs()) { // Ensure that the inputs are valid for the current stage
        setStep(step + 1);
      }
    } else if (step === 3) {
      if (validateInputs()) { // Ensure that the inputs are valid for the current stage
        handleSubmit();
      }
    }
  };
  
  const handleBack = () => setStep(step - 1);
  const validateInputs = () => {
    const newErrors:  FormErrors = {};
   
    // setErrors(newErrors);
    if (step === 1) {
      // Validate Stage 1 fields
      if (!formData.profileImg) newErrors.profileImg = 'Profile image is required';
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.password) newErrors.password = 'Password is required';
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.contactNo) newErrors.contactNo = 'contact no. is required';
    } else if (step === 2) {
      // Validate Stage 2 fields
      if (!formData.rollNo) newErrors.rollNo = 'Roll number is required';
      if (!formData.department) newErrors.department = 'Department is required';
      if(!formData.yearOfPassing) newErrors.yearOfPassing='passed out year is required';
        
    } else if (step === 3) {
      // Validate Stage 3 fields
      if (!formData.status) newErrors.status = 'Status is required';
      if (formData.status === 'GOT PLACED') {
        if (!formData.companyName) newErrors.companyName = 'Company Name is required';
        if (!formData.role) newErrors.role = 'Role is required';
        if (!formData.location) newErrors.location = 'Location is required';
      }
      if (formData.status === 'SEARCHING FOR JOB') {
       // if (selectedOptions.length === 0) newErrors.interest = 'At least one interest is required';
      }
      // if (!formData.portfolio) newErrors.portfolio = 'Portfolio link is required';
      // if (!formData.linkedIn) newErrors.linkedIn = 'LinkedIn link is required';
      if (!formData.myself) newErrors.myself = 'About Yourself is required';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
    //return formData.status === 'GOT PLACED' ? Object.keys(newErrors).length === 1 : Object.keys(newErrors).length === 4;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name as string]: value });
    setErrors({ ...errors, [name as string]: '' }); // Clear error on change
  };

  const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handlePassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update form data
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validate the password
    if (name === 'password') {
      if (!passwordPattern.test(value)) {
        setErrors({
          ...errors,
          password: 'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.',
        });
      } else {
        setErrors({
          ...errors,
          password: '',
        });
      }
    }
  };

  const handleRollnoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    let stringValue = value as string;

    // Convert to uppercase
    stringValue = stringValue.toUpperCase();

    // Validation for rollNo
    if (name === 'rollNo') {
      if (!/^[A-Z0-9]{0,10}$/.test(stringValue)) {
        setErrors({ ...errors, rollNo: 'Roll Number must be 10 characters, uppercase letters, and digits only.' });
      } else {
        setErrors({ ...errors, rollNo: '' });
      }
    }

    setFormData({ ...formData, [name as string]: stringValue });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png') && file.size <= 2 * 1024 * 1024) {
      setFormData({ ...formData, profileImg: file });
      setErrors({ ...errors, profileImg: '' });
    } else {
      setErrors({ ...errors, profileImg: 'File must be .jpg, .png or .jpeg and less than 2MB' });
    }
  };

  const navigate = useNavigate();
  const handleSubmitForm = async () => {
    loadingContext?.showLoading(true, "Fetching data, please wait...");
    if (validateInputs()) {
      try {
        const formDataToSend = new FormData();
        
        // Append the non-file form fields to formData
        Object.keys(formData).forEach((key) => {
          const value = formData[key as keyof typeof formData];
          if (key === "profileImg" && value instanceof File) {
            formDataToSend.append("profileImg", value);
          } else if (value) {
            formDataToSend.append(key, value as string);
          }
        });
  
        // Append the selectedOptions array (interests) as a JSON string
        if (selectedOptions.length > 0) {
          formDataToSend.append('interest', JSON.stringify(selectedOptions));
        }
        console.log(formDataToSend);
        // Make the POST request to send the form data
        const response = await axios.post('/api/register', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        loadingContext?.showLoading(false);
        if (response.data.status) {
          alertDialog?.showAlertDialog(
            "Registered successfully!!",
            "You can login after admin approval. An acknowledgement will be sent to your email once approved.",
            () => {
              navigate('/');
            }
          );
        } else {
          alertContext?.showAlert(response.data.message, "error");
          setTimeout(() => {
            navigate('/login');
          }, 1000);
        }
      } catch (error) {
        alertContext?.showAlert("Registration failed.", "error");
      }
    }
  };


 

  const validateEmail = (email:string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    // Check if the email is valid based on regex
    let isValid = emailRegex.test(email);
    
    // If valid, check for typos in domain and suggest corrections
    if (isValid) {
      Mailcheck.run({
        email: email,
        domains: ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'],  // Common domains
        topLevelDomains: ['com', 'net', 'org','in'],  // Common TLDs
        suggested: (suggestion) => {
          isValid=false;
        },
        empty: () => {
          console.log('No suggestion found.');
        }
      });
    }
  
    return isValid;
  };
  

  const sendOtp = async () => {
console.log(formData.email,validateEmail(formData.email));
if(validateEmail(formData.email)){
  loadingContext?.showLoading(true,"sending OTP...");
  try {
    const response = await axios.post('/api/send-otp', { email: formData.email });
    loadingContext?.showLoading(false);
    if (response.data.success) {
      setIsOtpSent(true);
      alertContext?.showAlert('OTP sent to your email.', 'success');
    } else {
      alertContext?.showAlert('Failed to send OTP.', 'error');
    }
  } catch (error) {
    alertContext?.showAlert('Error sending OTP.', 'error');
  }
  
    //console.log("erroe occured");
  }else{
   
    setErrors({
      ...errors,
      email: 'invalid email',
    });
  }
  };
  
  const verifyOtp = async () => {
    try {
      loadingContext?.showLoading(true,"verifying OTP,please wait...");
      const response = await axios.post('/api/verify-otp', { email: formData.email, otp });
      if (response.data.success) {
        setIsOtpVerified(true);
        loadingContext?.showLoading(false);
        alertContext?.showAlert('OTP verified successfully!', 'success');
      } else {
        setOtpError('Invalid OTP.');
      }
    } catch (error) {
      alertContext?.showAlert('Error verifying OTP.', 'error');
    }
  };
  

  return (
    <div>
      <Box className="m-10 mx-auto max-w-screen-md p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
        <Typography variant="h4" className="m-4 p-5 text-center text-indigo-700">Registration</Typography>
        {step === 1 && (
  <Box className="space-y-4">
    <Typography variant="h6">Personal Info</Typography>
    <div>
    <label htmlFor="profileImag" className="block text-sm font-medium text-gray-700">
                Profile Image (JPG/JPEG/PNG, less than 2MB)
              </label>
    <input
      type="file"
      accept="image/jpeg,image/png,image/jpg"
      name="profileImg"
      id="profileImg"
      onChange={handleFileChange}
      className="mt-1"
    />
    {errors.profileImg && <Typography color="error">{errors.profileImg}</Typography>}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <TextField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} fullWidth error={!!errors.firstName} helperText={errors.firstName} />
      </div>
      <div>
        <TextField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} fullWidth error={!!errors.lastName} helperText={errors.lastName} />
      </div>
    </div>
    <FormLabel component="legend">Gender</FormLabel>
    <RadioGroup name="gender" value={formData.gender} onChange={handleChange} row>
      <FormControlLabel value="MALE" control={<Radio />} label="Male" />
      <FormControlLabel value="FEMALE" control={<Radio />} label="Female" />
      <FormControlLabel value="OTHER" control={<Radio />} label="Other" />
    </RadioGroup>
    {errors.gender && <Typography color="error">{errors.gender}</Typography>}
    <TextField
      label="Contact No"
      name="contactNo"
      value={formData.contactNo}
      onChange={(e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.length <= 10) {
          setFormData({ ...formData, contactNo: value });
          if (value.length === 10) {
            setErrors({ ...errors, contactNo: '' });
          } else {
            setErrors({ ...errors, contactNo: 'Contact number must be exactly 10 digits' });
          }
        }
      }}
      fullWidth
      error={!!errors.contactNo}
      helperText={errors.contactNo}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Phone />
          </InputAdornment>
        ),
      }}
      inputProps={{
        type: 'tel',
        pattern: '[0-9]*',
        maxLength: 10,
      }}
    />
   <div className="w-full">
  {/* Email Input and Send Button in the same row */}
  <div className="flex w-full  items-center">
    <div className=" w-4/5  pr-5">
      <TextField
        label="Email"
        name="email"
        type='email'
        value={formData.email}
        onChange={handleChange}
        fullWidth
        disabled={isOtpSent}
        error={!!errors.email}
        helperText={errors.email}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email />
            </InputAdornment>
          ),
        }}
      />
    </div>
    <div className="w-1/5 pt-2">
      {!isOtpSent && (
        <Button variant="contained" color="primary" onClick={sendOtp}>
          Send OTP
        </Button>
      )}
      {isOtpSent && isOtpVerified && (
         <div className=" w-1/5  flex  pt-2">
         <VerifiedIcon sx={{ color: green[500], marginLeft: 1 }} fontSize="small" titleAccess="Verified email" />
         <span className="text-indigo-800">Email Verified</span>
       </div>
      )}
    </div>
  </div>

  {/* OTP Input in a new row */}
  {isOtpSent && !isOtpVerified && (
    <div className="w-full mt-4">
      <div className='p-2'>
          <Typography variant="body1">Enter OTP sent to <span className='text-amber-800 font-bold'>{formData.email}</span></Typography>
        </div>
      <TextField
        label="OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        fullWidth
        error={!!otpError}
        helperText={otpError}
        inputProps={{ maxLength: 6 }}
        style={{paddingBottom:2}}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={verifyOtp}
        disabled={otp.length < 6}
      >
        Verify OTP
      </Button>
    </div>
  )}

  {/* Email verified display */}
</div>

 <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handlePassChange}
              fullWidth
              error={!!errors.password}
              disabled={!isOtpVerified}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              disabled={!isOtpVerified}
              error={!!errors.address}
              helperText={errors.address}
            />


    <Box className="flex justify-between">
      <Button variant="contained" color="primary" onClick={handleNext} disabled={!isOtpVerified}>Next</Button>
    </Box>
  </Box>
)}

      {step === 2 && (
        <Box className="space-y-4">
          <Typography variant="h6">Educational Info</Typography>
          {/* <TextField 
          label="Roll Number" 
          name="rollNo" value={formData.rollNo} onChange={handleChange} fullWidth error={!!errors.rollNo} helperText={errors.rollNo} /> */}
          <TextField 
      label="Roll Number" 
      name="rollNo" 
      value={formData.rollNo} 
      onChange={handleRollnoChange} 
      fullWidth 
      error={!!errors.rollNo} 
      helperText={errors.rollNo} 
    />

      <InputLabel>Department</InputLabel>
      <Select
        name="department"
        value={formData.department}
        onChange={handleChange}
        fullWidth
      >
        <MenuItem value="CSE">CSE</MenuItem>
        <MenuItem value="ECE">ECE</MenuItem>
        <MenuItem value="EEE">EEE</MenuItem>
        <MenuItem value="CIVIL">CIVIL</MenuItem>
      </Select>
      <FormHelperText>{errors.department}</FormHelperText>
      <TextField
  label="Year of Passing"
  name="yearOfPassing"
  value={formData.yearOfPassing}
  onChange={handleChange}
  fullWidth
  error={!!errors.yearOfPassing}
  helperText={errors.yearOfPassing}
  inputProps={{
    type: 'number',
    min: 2010, // Set the minimum value to 2025
    step: 1  ,
    maxLength: 4  // Allows only integer values
  }}
/>

          <Box className="flex justify-between">
            <Button variant="outlined" onClick={handleBack}>Back</Button>
            <Button variant="contained" color="primary" onClick={handleNext}>Next</Button>
          </Box>
        </Box>
      )}

      {step === 3 && (
        <Box className="space-y-4">
          <Typography variant="h6">Professional Info</Typography>
          <label>Job Status</label>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="GOT PLACED">Got Placed</MenuItem>
            <MenuItem value="SEARCHING FOR JOB">Searching for Job</MenuItem>
          </Select>
          {formData.status === 'GOT PLACED' && (
            <>
              <TextField label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} fullWidth error={!!errors.companyName} helperText={errors.companyName} />
              <TextField label="Role" name="role" value={formData.role} onChange={handleChange} fullWidth error={!!errors.role} helperText={errors.role} />
              <TextField label="Location" name="location" value={formData.location} onChange={handleChange} fullWidth error={!!errors.location} helperText={errors.location} InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <LocationOnIcon />
          </InputAdornment>
        ),
      }} />
            </>
          )}
          {formData.status === 'SEARCHING FOR JOB' && (
            <>
            <Autocomplete
      multiple
      options={options}
      value={selectedOptions}
      onChange={(event, newValue) => setSelectedOptions(newValue)}
      renderInput={(params) => (
        <TextField {...params} variant="outlined" label="Select Interests" />
      )}
      filterSelectedOptions
    />
            </>
          )}
          <TextField
              label="Portfolio link"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="LinkedIn link"
              name="linkedIn"
              value={formData.linkedIn}
              onChange={handleChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon />
                  </InputAdornment>
                ),
              }}
            />
          <TextField label="About Yourself(for Bio)" name="myself" value={formData.myself} onChange={handleChange} fullWidth multiline rows={4} error={!!errors.myself} helperText={errors.myself} />
          <Box className="flex justify-between">
            <Button variant="outlined" onClick={handleBack}>Back</Button>
            <Button variant="contained" color="primary" onClick={handleSubmitForm}>Submit</Button>
          </Box>
        </Box>
      )}
    </Box>
    </div>
  );
};

export default Register;