import React, { useContext, useState } from 'react';
import { TextField, Button } from '@mui/material';
import axios from 'axios';
import { LoadingContext } from '../components/Contex/Loding';
import { AlertDialogContext } from '../components/Contex/AlertDialogProvider';
const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    subject: '',
    message: '',
  });
const loading=useContext(LoadingContext);
const alertDialog=useContext(AlertDialogContext);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try{
      loading?.showLoading(true);
    const response = await axios.post('/api/contactus', formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.status) {
      loading?.showLoading(false);
      alertDialog?.showAlertDialog(
        "Reminder!!",
        "admin will responds to you in soon using your email or contact number",
        () => {
          setFormData({
            name: '',
            email: '',
            contactNumber: '',
            subject: '',
            message: '',
          })
        }
      );
    } else {
      loading?.showLoading(false);
      console.log(response.data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error adding job.');
  }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Contact Us</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            className="bg-gray-50"
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            className="bg-gray-50"
            type="email"
          />
          <TextField
            label="Contact Number"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            fullWidth
            className="bg-gray-50"
          />
          <TextField
            label="Subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            fullWidth
            className="bg-gray-50"
          />
          <TextField
            label="Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            className="bg-gray-50"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="mt-4"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
