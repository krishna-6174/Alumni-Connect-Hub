import { Request, Response, Router } from 'express';
import  pool  from '../services/db';
const router=Router();

router.post('/contactus', async (req:Request, res:Response) => {
    const { name, email, contactNumber, subject, message } = req.body;
  try{
    // Insert data into the contactus table
    const sql = 'INSERT INTO contactus (name, email, contactNumber, subject, message) VALUES (?, ?, ?, ?, ?)';
    const [rows]=await pool.query(sql, [name, email, contactNumber, subject, message]);
    res.status(201).json({
        status:true,
        message:"record saved!!"
     // Assuming you want to return the inserted event ID
    });
}
catch(error){
    res.status(201).json({
        status:false,
        message:"error ocured",
     // Assuming you want to return the inserted event ID
    });
}
  });
  export default router;