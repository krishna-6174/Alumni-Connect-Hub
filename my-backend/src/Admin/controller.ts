import { Router } from "express";
import bcrypt from 'bcrypt';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import{ Request, Response } from 'express';
import pool from "../services/db"
import fs from 'fs';
const router=Router()
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads'); // Directory where files will be stored
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + ext); // Use current timestamp as filename
    },
  });
  const upload = multer({
    storage,
    fileFilter: (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
      const allowedTypes = ['image/jpeg', 'image/png','image/jpg'];
      if (allowedTypes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
  });

router.post('/admin/add', upload.single('profile'), async (req:Request, res:Response) => {
    try{


    const { name, email, password, contactno } = req.body;
    
    const profileImage = req.file ? req.file.filename : null;
    const hashedPassword = await bcrypt.hash(password, 10);
    // Validate fields
    if (!name || !email || !password || !contactno) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
  
    // Insert admin data into the database
    const query = 'INSERT INTO admins (name, email, password, contactno, profile) VALUES (?, ?, ?, ?, ?)';
    await pool.query(query, [name, email, hashedPassword, contactno, profileImage]);

    res.status(200).json({ status: true, message: 'Registration successful!' });
} catch (error) {
  console.error(error);
  res.status(500).json({ status: false, message: 'Registration failed.' });
}   
  });
  export default router;