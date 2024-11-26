import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import express, { Request, Response } from 'express';
import pool from '../services/db';
import { galleries } from '../../types/interface';
import { RowDataPacket } from 'mysql2';
import { v4 as uuidv4 } from 'uuid';
const router = express.Router();

// Multer configuration for storing files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Gallery');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`; // Combine timestamp with UUID
    cb(null, `${uniqueSuffix}${ext}`); // Use current timestamp as filename
  },
});

// Multer configuration with file filter and size limits
const upload = multer({
  storage,
  fileFilter: (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error('Only .jpeg, .png, and .jpg formats are allowed!'));
    }
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
});

// Type guard to check if req.files is defined and has the expected structure
const isFilesObject = (files: any): files is { [fieldname: string]: Express.Multer.File[] } => {
  return files && typeof files === 'object' && !Array.isArray(files);
};
export async function getGallery(req:Request,res:Response) {
  try{
    const query = `
        SELECT event_name,event_type, cover_image, COUNT(*) AS total_items 
        FROM gallery 
        GROUP BY event_name,event_type,cover_image;
    `;
    const [rows]= await pool.query<RowDataPacket[]>(query);
    const gallery=rows as  galleries[];

    const updatedRows = gallery.map((row: galleries) => {
      const imageUrl = row.cover_image !== 'Profile not sent'
        ? `http://192.168.139.5:6969/Gallery/${row.cover_image}`
        : 'Profile not sent'; 
      return {
        ...row,
        cover_image: imageUrl
      };
    });
    console.log(updatedRows);
    return res.status(201).json({
      ststus:true,
      galleries:updatedRows
    })
  }catch(error){
    console.log("error in getting the gallery",error);
    res.status(500).json({message:'unable to retrieve the data'});
  }
}
export async function getAlbum(req: Request, res: Response) {
  const { eventName } = req.params; // Destructure the event_name from req.params
  console.log("eventname ",eventName);
  try {
    // Query to get file_name, created_at, and cover_image for the given event_name
    const [rows] = await pool.query<RowDataPacket[]>("SELECT file_name, created_at, cover_image FROM gallery WHERE event_name = ?",[eventName]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "No event found with the given name" });
    }

    // Extracting the created_at and cover_image from the first row (assuming all rows have the same date and cover)
    const createdDate = rows[0].created_at;

    const coverImage = `http://192.168.139.5:6969/Gallery/${rows[0].cover_image}`;

    // Mapping file_name to URL and collecting them into an array
    const images = rows.map((row: any) => `http://192.168.139.5:6969/Gallery/${row.file_name}`);
    console.log(images);
    // Sending the response with created_date, cover_image, and the array of images
    res.status(200).json({
      event_name:eventName,
      item_count:rows.length,
      created_date: createdDate,
      cover_image: coverImage,
      images,
    });
  } catch (error) {
    console.error("Error at getAlbum", error);
    res.status(500).json({ message: "Unable to retrieve the data" });
  }
}

// Route to handle gallery upload
router.post('/admin/savegallery', upload.fields([
  { name: 'cover_image', maxCount: 1 }, // Single cover image
  { name: 'images', maxCount: 100 } // Multiple other images
]), async (req: Request, res: Response) => {
  try {
    const { event_name } = req.body; // Get the event name from form data

    // Use type guard to safely access req.files properties
    const files = req.files;
    const filesObject = isFilesObject(files) ? files : {};

    const coverImage = (filesObject['cover_image'] as Express.Multer.File[] | undefined) || [];
    const images = (filesObject['images'] as Express.Multer.File[] | undefined) || [];

    if (!event_name || images.length === 0) {
      return res.status(400).json({ message: 'Event name and at least one image are required' });
    }

    const user_id = req.user?.id as number;

    // Prepare data for insertion into the database
    const coverImageName = coverImage.length > 0 ? coverImage[0].filename : null;

    // Insert cover image filename into the gallery table
    

    // Prepare data for other images
    const imageValues = images.map(file => [user_id, event_name, file.filename]);
    console.log(imageValues);
    // Insert other images into the gallery table
    if (imageValues.length > 0) {
      const query = `INSERT INTO gallery (user_id, event_name, file_name) VALUES ?`;
      await pool.query(query, [imageValues]);
    }
    console.log(coverImageName);
    const coverImageInsertQuery = 
    `UPDATE gallery g
SET g.cover_image = ?, 
    g.event_type = (SELECT e.event_type FROM events e WHERE e.event_name = g.event_name)
WHERE g.event_name = ? AND g.user_id = ?;
`;
    if (coverImageName) {
      await pool.query(coverImageInsertQuery, [coverImageName, event_name, user_id]);
    }
    return res.status(200).json({
      status: true,
      message: 'Gallery images saved successfully',
    });
  } catch (err) {
    console.error('Error saving gallery:', err);
    res.status(500).json({ status: false, message: 'Failed to save gallery' });
  }
});
 export async function getAttendees(req:Request,res:Response) {
  

  const eventName = req.params.eventName;

  try {
    const [attendees]: any = await pool.query(`
      SELECT a.id, a.Name, a.profile, a.Department, a.PassedOutYear
      FROM event_attendees ea
      JOIN alumnis a ON ea.alumni_id = a.id
      WHERE ea.event_name = ?
    `, [eventName]);
    
    if (!attendees.length) {
      return res.status(404).json({ message: 'No attendees found for this event' });
    }
    console.log(attendees);
    res.json({attendees:attendees});
  } catch (error) {
    console.error('Error fetching alumni data', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
export default router;
