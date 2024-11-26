import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
  secure: true, // use TLS
    auth: {
      user: 'krishnabandla03@gmail.com', // Replace with your email
      pass: 'tzalahotfhljzeri'   // Replace with your email password or app password
    }
  });
  const otpStore: Record<string, string> = {};
  export async function VerifyOtp(req:Request,res:Response) {
    
    const { email, otp } = req.body;
    console.log(req.body);
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }
  
    // Verify OTP
    console.log(otpStore[email]===otp);
    if (otpStore[email] === otp) {

      delete otpStore[email]; // Remove OTP after successful verification
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ success: false, message: 'Invalid OTP' });
    }


  }
export async function SendOtp( req:Request,res:Response) {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
  
    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    otpStore[email] = otp;
    console.log(otpStore[email]);
  
    // Send OTP to the email
    transporter.sendMail({
      from: 'krishnabandla03@gmail.com', // Replace with your email
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`
    }, (error: any, info: any) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Failed to send OTP' });
      }
      console.log(email," otp sent : ",otp);
      res.status(200).json({ success: true });
    });
}