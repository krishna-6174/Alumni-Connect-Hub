import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import express, { Request, Response } from 'express';
import pool from '../services/db';
import { events } from '../../types/interface';
import { RowDataPacket } from 'mysql2/promise';
import { format } from 'date-fns';
import fs from 'fs';
const router = express.Router();

// Multer configuration for storing files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Gallery'); 
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Use current timestamp as filename
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
export async function getNames(req:Request,res:Response){
try{
  const [rows]=await pool.query("select event_name from events");
  console.log(rows);
  res.status(201).json({status:true,names:rows});

}catch(error){console.log("erorr occured");
  res.status(401).json({status:false,message:'error occured while retrieving names fom db'})

}

}
export async function getEvent(req:Request,res:Response){
  const id=req.params.id;
  try{
    const [rows]=await pool.query('select event_name,event_date,event_time,location,image_url,description,status from events where event_id=?',[id]);
    const events=rows as events[];
    const profile= `http://192.168.139.5:6969/Gallery/${events[0].image_url}`
    const updated={
      ...events[0],
      profile
    }
    console.log(updated);
    res.status(201).json({status:true,event:updated});

  }catch(error){
    console.log("error ocuured while getting event details",id);
    res.status(401).json({status:false,message:'error occured'});
  }

}
const deleteProfileImage = (filename: string): void => {
  const filePath = path.join(__dirname, '../../Gallery', filename);

  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Failed to delete file: ${filePath}`, err);
      } else {
        console.log(`Successfully deleted file: ${filePath}`);
      }
    });
  } else {
    console.log(`File does not exist: ${filePath}`);
  }
};
export async function deleteEvent(req:Request,res:Response) {
  const id = req.params.id;
  console.log(id);
  try{
    const [rows]= await pool.query("select image_url from events WHERE event_id = ?",[id]);
    const row=rows as [{image_url:string}];
    deleteProfileImage(row[0]?.image_url);
    const [deleted]= await pool.query("DELETE FROM  events WHERE event_id = ?",[id]);
    res.status(201).json({
      status:'success',
      message:'DELETED successfully!!!'
    });
  }
  catch(err){
    const error = err as Error;
    console.error('Error in transaction', error.stack);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
}

export async function getEvents(req:Request,res:Response){
    try{
        const [rows]=await pool.query('select event_id,event_name,event_date,event_time,location,description,image_url,status from events');
        const events=rows as events[]
        const updatedRows = events.map((row:events) => {
          const imageUrl = row.image_url !== 'Profile not sent'
            ? `http://192.168.139.5:6969/Gallery/${row.image_url}`
            : 'Profile not sent'; 
          return {
            ...row,
            profile: imageUrl
          };
        });
        console.log(updatedRows);
        res.status(201).json({status:true,events:updatedRows});

    }catch(error){
        console.log("error   ",error);
        res.status(401).json({status:false,message:'error occured in catch()'});
    }
}
export async function getCount(req:Request,res:Response) {
  try{
    const [rows]=await pool.query("select COUNT(*) as count from events");
    const row=rows as [{count:string}];
    res.status(201).json({status:true,count:row[0].count});
  
  }catch(error){console.log("erorr occured");
    res.status(401).json({status:false,message:'error occured while retrieving names fom db'})
  
  }
}
router.post('/events/join', async (req, res) => {
  const { eventName } = req.body;
  const userId=req.user?.id;
  
  try {
    await pool.query("INSERT INTO event_attendance (user_id, event_name) VALUES (?, ?)", [userId, eventName]);
    res.status(200).send({ message: "User added to event" });
  } catch (error) {
    res.status(500).send({ message: "Failed to join event" });
  }
});



const getTimeString = (eventTime: string): string => {
  const date = new Date(eventTime); // Convert the string to a Date object
  return format(date, 'HH:mm:ss'); // Format the time as "hh:mm a"
};
router.post('/admin/addEvent', upload.single('eventBanner'), async (req: Request, res: Response) => {
  console.log(req.body);
    try {
        const { eventName, eventType,eventDescription, eventDate, eventTime, location} = req.body;
        const image_url = req.file ? req.file.filename : '';
        let eDate=new Date(eventDate);
        // let eTime=new Date(eventTime)
 const formattedDate = eDate.toISOString().split('T')[0]; // "2024-11-20"
const formattedeventTime = getTimeString(eventTime); // "00:00:00"
console.log(formattedeventTime);
        const userData={
            event_name:eventName,
            event_date:formattedDate,
            event_time:formattedeventTime,
          location,
          description:eventDescription,
          event_type:eventType,
          image_url,
          admin_id:req.user?.id
        };
        const [result]=await pool.query('INSERT INTO EVENTS SET ?', userData);
        // Send success response
        res.status(201).json({
            status:true,
          message: 'Event created successfully',
          eventId: (result as any).insertId, // Assuming you want to return the inserted event ID
        });
      } catch (error) {
        // Handle any errors
        console.error(error);
        res.status(500).json({ status:false,message: 'Server error' });
      }
  });


export default router;
