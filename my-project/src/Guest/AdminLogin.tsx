import React, { useContext, useState } from 'react';
import { TextField, Button, IconButton, InputAdornment, Container, Typography, Link,} from '@mui/material';
import { Email, Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import LockIcon from '@mui/icons-material/Lock';
import axios from 'axios';
import { AlertContext } from "../components/Contex/AlertDetails";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/Auth/AuthProvider';
const AdminLogin: React.FC = () => {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    
    const toggleShowPassword = () => setShowPassword(!showPassword);
    const navigate = useNavigate();
    const authContext = useAuth();
    const alertContext = useContext(AlertContext);
    const onSubmit = async (data: any) => {
      
      try {
        const response = await axios.post('http://localhost:6969/api/adminlogin', data,{
          withCredentials: true, // Important for sending/receiving cookies
      });
      if (response.data.goAhead) {
        sessionStorage.setItem("name", response.data.user.name);
        sessionStorage.setItem("id",response.data.user.id);
        sessionStorage.setItem("email",response.data.user.email);
        sessionStorage.setItem("role","admin");
        authContext?.setUser({
          id:response.data.user.id,
          role:'admin'
        });
        alertContext?.showAlert("Login successful!!!", "success");
        
        setTimeout(() => {
          navigate("/admin/dashboard"); // Redirect to the alumni dashboard
        }, 1000);
      } else {
          alertContext?.showAlert(response.data.message, "error");
        }
      } catch (error) {
        // Handle error
        alertContext?.showAlert('An error occurred. Please try again later.', "error");
      }
    };

  return (
    <Container maxWidth="sm" className="m-10 mx-auto  p-6 border border-gray-300 rounded-lg shadow-lg  bg-white">
        
      <Typography variant="h4" gutterBottom className='text-center pb-5 '>Admin Login</Typography>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
        <Controller
          name="email"
          control={control}
          defaultValue=""
          rules={{
            required: 'Email is required',
            pattern: { value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, message: 'Invalid email address' }
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              variant="outlined"
              fullWidth
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ''}
              className="mb-4"
              InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          defaultValue=""
          rules={{
            required: 'Password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters' },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
              message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
            }
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Password"
              variant="outlined"
              fullWidth
              type={showPassword ? 'text' : 'password'}
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ''}
              InputProps={{
                  startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon />
                      </InputAdornment>
                    ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggleShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        <Link href="#" className="text-blue-500 hover:underline text-sm">Forgot Password?</Link>
        <Button type="submit" variant="contained" color="primary" fullWidth className="mt-4">
          Login
        </Button>
      </form>
    </Container>
  );
};

export default AdminLogin;

