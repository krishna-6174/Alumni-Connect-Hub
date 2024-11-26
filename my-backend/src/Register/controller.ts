import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import db from "../services/db"
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { RowDataPacket } from 'mysql2/promise';
const router = express.Router();
interface CountResult extends RowDataPacket {
    count: number;
  }
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`; // Combine timestamp with UUID
    cb(null, `${uniqueSuffix}${ext}`); // Use current timestamp as filename
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

const checkRollNumberExists = async (Rollno: string,email: string): Promise<boolean> => {
    const [rows] = await db.query<CountResult[]>('SELECT count(*) as count FROM ALUMNIS WHERE Rollno = ? or email = ?', [Rollno,email]);
    // console.log(rows[0].count)
    return rows[0].count > 0;
  };
  const deleteProfileImage = (filename: string): void => {
    const filePath = path.join(__dirname, '../../uploads', filename);
  
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Failed to delete file: ${filePath}`, err);
      } else {
        console.log(`Successfully deleted file: ${filePath}`);
      }
    });
  };
  

router.post('/register', upload.single('profileImg'), async (req: Request, res: Response) => {
  try { console.log(req.body);
    const {
      firstName,
      lastName,
      gender,
      email,
      password,
      rollNo,
      department,
      yearOfPassing,
      status,
      companyName,
      role,
      location,
      interest,
      myself,
      contactNo,
      portfolio,
      linkedIn,
      address
    } = req.body;
   
    const profileImg = req.file ? req.file.filename : '';

    // Check if the roll number or email already exists
    const rollExists = await checkRollNumberExists(rollNo, email);
    if (rollExists) {
      deleteProfileImage(profileImg); // Optional: Delete the image if it was uploaded
      return res.status(200).json({ status: false, message: 'Roll number or email already exists.' });
    }

    // Encrypt the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    const fullName = `${firstName} ${lastName}`;

    // Prepare the user data object
    const userData = {
      name: fullName,
      gender,
      email,
      password: hashedPassword,
      Rollno: rollNo,
      dept: department,
      poy: yearOfPassing,
      job_status: status,
      companyname: companyName,
      role,
      loc: location,
      interest,
      myself,
      profile: profileImg,
      contactno: contactNo,
      Portfolio: portfolio,
      address,
      status: 'inactive', // Set default status as 'inactive'
    };

    // Insert data into the `alumnis` table
    await db.query('INSERT INTO ALUMNIS SET ?', userData);

    // Send a success response
    res.status(200).json({ status: true, message: 'Registration successful!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Registration failed.' });
  }
});

export default router;
