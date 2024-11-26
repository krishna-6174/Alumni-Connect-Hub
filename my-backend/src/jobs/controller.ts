import { Request, Response } from 'express';
import  pool  from '../services/db'; // Assuming pool is exported from db.js
import { Jobdetails, jobs } from '../../types/interface';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { RowDataPacket } from 'mysql2';
interface Jobcard {
  id: number;
  job_type: string;
  job_title: string;
  company_name: string;
  location: string;
  salary: number;
  deadline: string;
  posted_date: string;
  user_id: number;
  user_name: string | null;
  user_avatar: string;
}


export async function getCount(req:Request,res:Response) {
  try{
    console.log("jas vkjhgfd");
    const [rows]=await pool.query("select COUNT(*) as count from jobs where status=? ",['inactive']);
    const row=rows as [{count:string}];
    res.status(201).json({status:true,count:row[0].count});
  
  }catch(error){console.log("erorr occured");
    res.status(401).json({status:false,message:'error occured while retrieving names fom db'})
  
  }
}
// Initialize DOMPurify for server-side usage
const window = new JSDOM('').window;
const purify = DOMPurify(window);
export async function jobsforcard(req: Request, res: Response) {

try{
  const [rows] = await pool.query<RowDataPacket[]>("SELECT j.id, j.job_type, j.job_title, j.company_name, j.location, j.salary,j.stipend, j.deadline, j.posted_date, j.user_id,j.role, CASE WHEN j.role = 'alumni' THEN a.name ELSE NULL END AS user_name, CASE WHEN j.role = 'alumni' THEN a.profile ELSE 'Profile not sent' END AS user_avatar FROM jobs AS j LEFT JOIN alumnis AS a ON j.user_id = a.id WHERE j.status = 'active'");

  // Cast rows to Jobcard[]
  const jobcards: Jobcard[] = rows as Jobcard[];

  // Map through rows to update user_avatar with the correct URL
  const updatedRows = jobcards.map((row: Jobcard) => {
    const imageUrl = row.user_avatar !== 'Profile not sent'
      ? `http://192.168.139.5:6969/uploads/${row.user_avatar}`
      : 'Profile not sent'; 
    return {
      ...row,
      user_avatar: imageUrl
    };
  });
  console.log(updatedRows);
  res.status(201).json({
    status:true,
    jobsforcard:updatedRows
  })
}catch (error) {
  console.error('Error adding job:', error);
  res.status(500).json({ status: false, message: 'Failed to add job' });
}


}
export async function addJob(req: Request, res: Response) {
  try {
    const { jobType, jobTitle, companyName, location, salary, stipend, deadline, workFromHome, duration, startDate, websiteUrl, roleInfo, companyInfo } = req.body;
    let uplocation=location
    if (workFromHome){
      uplocation="work from home";
    }
    // Convert deadline and startDate to 'YYYY-MM-DD' format
    const formattedDeadline = new Date(deadline).toISOString().split('T')[0];
    const formattedStartDate = new Date(startDate).toISOString().split('T')[0];

    // Sanitize roleInfo and companyInfo to prevent XSS attacks
    const sanitizedRoleInfo = purify.sanitize(roleInfo);
    const sanitizedCompanyInfo = purify.sanitize(companyInfo);

    const query = `INSERT INTO jobs 
        (job_type, job_title, company_name, location, salary, stipend, deadline, duration, start_date, website_url, role_info, company_info, user_id, role, posted_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    const currentDate: Date = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const postedDate = `${year}-${month}-${day}`;
    const values = [
        jobType,
        jobTitle,
        companyName,
        uplocation,
        salary,
        stipend,
        formattedDeadline,  // Use the formatted deadline
        duration,
        formattedStartDate,  // Use the formatted startDate
        websiteUrl,
        sanitizedRoleInfo,
        sanitizedCompanyInfo,
        req.user?.id,
        req.user?.role,
        postedDate
    ];

    const [result] = await pool.query(query, values);

    res.status(201).json({ 
        goahead: true,
        message: 'Job added successfully'
    });
} catch (error) {
    console.error('Error adding job:', error);
    res.status(500).json({ goahead: false, message: 'Failed to add job' });
}

}

export async function getJob(req: Request, res: Response) {
  const id = req.params.id;
  try {
    const [rows] = await pool.query(
      `SELECT job_type, job_title, company_name, location, salary, stipend, deadline, 
       duration, start_date, website_url, role_info, company_info, 
      posted_date, status FROM jobs WHERE id = ?`,
      [id]
    );
    const row = rows as Jobdetails[];
    
    // If no job is found with the given ID
    if (row.length === 0) {
      return res.status(404).json({ status: false, message: 'Job not found' });
    }
  console.log(row);
    // Sanitize role_info and company_info fields
    const sanitizedRoleInfo = purify.sanitize(row[0].role_info);
    const sanitizedCompanyInfo = purify.sanitize(row[0].company_info);
  
    res.status(200).json({
      status: true,
      job: {
        ...row[0],
        role_info: sanitizedRoleInfo,       // Send sanitized role_info
        company_info: sanitizedCompanyInfo, // Send sanitized company_info
      }
    });
  } catch (error) {
    console.error('Error retrieving job:', error);
    res.status(500).json({ status: false, message: 'Failed to retrieve job data' });
  }
  

}
export async function deleteJob(req: Request, res: Response) {
  const id=req.params.id;
  try{
    const [rows]:any=await pool.query("DELETE from  jobs  where id=?",[id]);
    if(rows.affectedRows > 0){
      res.status(201).json({
        status:true,
        message:'updated successfully!!1'
      })
    }
  }
  catch(error){
    console.error('Error adding job:', error);
    res.status(500).json({ status:false, message: 'Failed to update  job' });
  }
}
export async function updateJob(req: Request, res: Response) {
const id=req.params.id;
try{
  const [rows]:any=await pool.query("update jobs set status=? where id=?",['active',id]);
  if(rows.affectedRows > 0){
    res.status(201).json({
      status:true,
      message:'updated successfully!!1'
    })
  }
}
catch(error){
  console.error('Error adding job:', error);
  res.status(500).json({ status:false, message: 'Failed to update  job' });
}


}

export async function getJobs(req: Request, res: Response){

        try {
            console.log("hi..i am managejobs");
          // Fetch jobs with status 'inactive'

          const [rows] = await pool.query("SELECT id,job_type, job_title, company_name, location, deadline,user_id,role,status FROM jobs WHERE status='inactive'");
    
          const jobs =rows as jobs;
    
            console.log(jobs);
          // Commit the transaction
    
          // Send the jobs to the frontend
          res.json({
            status: 'success',
            message: `${jobs.length} jobs fetched and updated to active.`,
            jobs: jobs,
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


      export async function getActiveJobs(req: Request, res: Response){

        try {
            console.log("hi..i am managejobs");
          // Fetch jobs with status 'inactive'

          const [rows] = await pool.query("SELECT id,job_type, job_title, company_name, location, deadline,user_id,role,status FROM jobs WHERE status='active'");
    
          const jobs =rows as jobs;
    
            console.log(jobs);
          // Commit the transaction
    
          // Send the jobs to the frontend
          res.json({
            status: 'success',
            message: `${jobs.length} jobs fetched and updated to active.`,
            jobs: jobs,
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

