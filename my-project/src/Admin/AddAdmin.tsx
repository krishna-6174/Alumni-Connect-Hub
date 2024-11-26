import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextField, Button, IconButton, FormControl, FormHelperText, InputAdornment, Container } from '@mui/material';
import { Email, Visibility, VisibilityOff, Phone, Lock, Image } from '@mui/icons-material';
import axios from 'axios';

// Validation Schema
const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/(?=.*[a-z])/, 'Must contain at least one lowercase letter')
    .matches(/(?=.*[A-Z])/, 'Must contain at least one uppercase letter')
    .matches(/(?=.*[0-9])/, 'Must contain at least one number')
    .matches(/(?=.*[!@#$%^&*])/, 'Must contain at least one special character'),
  retypePassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please retype your password'),
  contactno: yup.string()
    .matches(/^\d{10}$/, 'Contact number must be exactly 10 digits'),
  profile: yup.mixed()
    .required('Profile image is required')
    .test('fileSize', 'File size must be less than 2MB', (value: any) => value && value.size < 2 * 1024 * 1024)
    .test('fileType', 'Only JPEG, JPG, and PNG files are allowed', (value: any) => value && ['image/jpeg', 'image/png'].includes(value.type))
});

type FormData = yup.InferType<typeof schema>;

const AdminForm: React.FC = () => {
  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onBlur'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const handleProfileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setImageError('File size must be less than 2MB');
      } else if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setImageError('Only JPEG and PNG files are allowed');
      } else {
        setProfileImage(file);
        setValue('profile', file);
        setImageError(null);
      }
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      // Create a FormData object to handle file uploads
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('contactno', data.contactno);
      if (profileImage) formData.append('profile', profileImage);

      // Send data to the backend
      console.log(formData);
      const response = await axios.post('/api/admin/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials:true
      });

      if (response.data.status) {
        // Clear form fields
        
        reset();
        setProfileImage(null);
        setImageError(null);
        alert("Admin added successfully!! ");
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className='mt-10'>
      <Container maxWidth="md" className="m-10 mx-auto p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
        <h2 className='text-2xl text-center font-bold p-5'>Add Admin</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Profile Image Field */}
          <div>
            <label htmlFor="profile" className="block text-sm font-medium text-gray-700">
              Profile Image (JPG/JPEG/PNG, less than 2MB)
            </label>
            <input
              type="file"
              id="profile"
              accept="image/jpeg, image/jpg, image/png"
              onChange={handleProfileChange}
              className="mt-1 block w-full text-gray-700 rounded-md shadow-sm"
            />
            {imageError && <FormHelperText error>{imageError}</FormHelperText>}
            {errors.profile && <FormHelperText error>{errors.profile.message}</FormHelperText>}
          </div>

          {/* Name Field */}
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Name"
                variant="outlined"
                fullWidth
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          {/* Email Field */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                variant="outlined"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  )
                }}
              />
            )}
          />

          {/* Password Field */}
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <FormControl variant="outlined" fullWidth error={!!errors.password}>
                <TextField
                  {...field}
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <IconButton
                        edge="end"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    ),
                  }}
                />
                {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
              </FormControl>
            )}
          />

          {/* Retype Password Field */}
          <Controller
            name="retypePassword"
            control={control}
            render={({ field }) => (
              <FormControl variant="outlined" fullWidth error={!!errors.retypePassword}>
                <TextField
                  {...field}
                  type={showRetypePassword ? 'text' : 'password'}
                  label="Retype Password"
                  variant="outlined"
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <IconButton
                        edge="end"
                        onClick={() => setShowRetypePassword(!showRetypePassword)}
                        aria-label="toggle password visibility"
                      >
                        {showRetypePassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    ),
                  }}
                />
                {errors.retypePassword && <FormHelperText>{errors.retypePassword.message}</FormHelperText>}
              </FormControl>
            )}
          />

          {/* Contact Number Field */}
          <Controller
            name="contactno"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Contact Number"
                variant="outlined"
                fullWidth
                error={!!errors.contactno}
                helperText={errors.contactno?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  )
                }}
              />
            )}
          />

          {/* Submit Button */}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Add Admin
          </Button>
        </form>
      </Container>
    </div>
  );
};

export default AdminForm;
