import { Request, Response } from 'express';
import  pool  from '../services/db'; // Assuming pool is exported from db.js
import {  alumnis, detailofAlumni } from '../../types/interface';
import { profile } from 'console';
import path from 'path';
import fs from "fs"

export async function getCount(req:Request,res:Response) {
  try{
    const [rows]=await pool.query("select COUNT(*) as count from alumnis where status='inactive' ");
    const row=rows as [{count:string}];
    res.status(201).json({status:true,count:row[0].count});
  
  }catch(error){console.log("erorr occured");
    res.status(401).json({status:false,message:'error occured while retrieving names fom db'})
  
  }
}
export async function getTotal(req:Request,res:Response) {
  try{
    const [rows]=await pool.query("select COUNT(*) as count from alumnis");
    const row=rows as [{count:string}];
    res.status(201).json({status:true,count:row[0].count});
  
  }catch(error){console.log("erorr occured");
    res.status(401).json({status:false,message:'error occured while retrieving names fom db'})
  
  }
}


export async function alumnisforCard(req: Request, res: Response){
  try{
    const [row]= await pool.query("SELECT  id,profile, name as Name,dept as Department, poy as PassedOutYear  FROM alumnis where status='active'");
    const Alumnis=row as detailofAlumni[];
    console.log(Alumnis);
    //const imageUrl = `http://localhost:6969/uploads/${Alumnis[0].profile}`;
    const updatedRows = Alumnis.map((row:detailofAlumni ) => {
      const imageUrl = row.profile !== 'Profile not sent'
        ? `http://192.168.139.5:6969/uploads/${row.profile}`
        : 'Profile not sent'; 
      return {
        ...row,
        profile: imageUrl
      };
    });
    console.log(updatedRows);
    res.status(201).json({
      status:'success',
      alumnis:updatedRows
    });
  }
  catch(err){
    const error = err as Error;
    console.error('Error in transaction', error.stack);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }

}


export async function getActiveAlumnisDetails(req: Request, res: Response){

  try {

    const [rows] = await pool.query("SELECT id,name,Rollno,email,dept,poy,status FROM alumnis where status=?",['active']);

    const Alumnis =rows as alumnis;

      console.log(Alumnis);
    // Commit the transaction
  

    // Send the jobs to the frontend
    res.json({
      status: 'success',
      length: Alumnis.length,
      alumnis: Alumnis,
    });
  } catch (err) {
    // Rollback in case of error
    const error = err as Error;
    console.error('Error in transaction', error.stack);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }// finally {
  //   pool.release();
  // }
} 


export async function getAlumnisDetails(req: Request, res: Response){

    try {

      const [rows] = await pool.query("SELECT id,name,Rollno,email,dept,poy,status FROM alumnis where status=?",['inactive']);

      const Alumnis =rows as alumnis;

        console.log(Alumnis);
      // Commit the transaction
    

      // Send the jobs to the frontend
      res.json({
        status: 'success',
        length: Alumnis.length,
        alumnis: Alumnis,
      });
    } catch (err) {
      // Rollback in case of error
      const error = err as Error;
      console.error('Error in transaction', error.stack);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }// finally {
    //   pool.release();
    // }
  } 
  const deleteProfileImage = (filename: string): void => {
    const filePath = path.join(__dirname, '../../uploads', filename);
  
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
  export async function deleteAlumni(req: Request, res: Response){
    const id = req.params.id;
    try{
      const [rows]= await pool.query("select profile from alumnis WHERE id = ?",[id]);
      const row=rows as [{profile:string}];
      deleteProfileImage(row[0]?.profile);
      const [deleted]= await pool.query("DELETE FROM  alumnis WHERE id = ?",[id]);
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
  
  export async function updateAlumni(req: Request, res: Response){
    const id = req.params.id;
    try{
      const [row]= await pool.query("UPDATE alumnis SET status = ? WHERE id = ?",['active',id]);
      res.status(201).json({
        status:'success',
        message:'alumni status updated successfully!!!'
      });
    }
    catch(err){
      const error = err as Error;
      console.error('Error in transaction', error.stack);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }

  export async function getAlumni(req: Request, res: Response){
    const id = req.params.id;
    try{
      const [row]= await pool.query("SELECT  profile, name as Name, gender as Gender, Rollno,contactno as Mobile, email as Email,address, dept as Department, poy as PassedOutYear, job_status, interest, companyname, loc as Location, role as Job_role,portfolio,linkedIn, myself FROM alumnis where id=?",[id]);
      const Alumni=row as detailofAlumni[];
      console.log(Alumni);
      const imageUrl = `http://192.168.139.5:6969/uploads/${Alumni[0].profile}`;
      const updatedData={
        ...Alumni[0],
        profile:imageUrl
      }
      res.status(201).json({
        status:'success',
        alumni:updatedData
      });
    }
    catch(err){
      const error = err as Error;
      console.error('Error in transaction', error.stack);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }
