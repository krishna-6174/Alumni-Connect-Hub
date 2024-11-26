export interface job{
id:BigInteger,
job_tittle:string,
company_name:string,
job_location:string,
employment_type:string,
salary_range:string
}
export interface alumni{
    id:BigInteger,
    full_name:string,
    roll_no:string,
    email:string,
    department:string,
    passed_out_year:string
}
export type detailofAlumni={
        id: number;              // Primary key, auto_increment
        profile?: string | null; // Profile picture or URL
        name: string;            // Alumni name
        gender?: 'MALE' | 'FEMALE' | 'OTHER' | null; // Enum for gender
        Rollno: string;          // Primary key for Roll number
        email: string;           // Primary key for email
        password?: string | null; // Encrypted password
        dept?: string | null;    // Department
        poy?: number | null;     // Passing out year
        job_status?: string | null; // Current job status
        interest?: string | null; // Alumni's interests
        companyname?: string | null; // Current company name
        loc?: string | null;     // Location
        role?: string | null;    // Role of the alumni
        myself?: string | null;  // Description text about themselves
        status?: 'active' | 'inactive'; // Status of the alumni account
}
export interface events{
  event_id:nuber;
  event_name:string;
  event_date:string;
  event_time:string;
  location:string;
  image_url:string;
  status:'UPCOMING'|'PAST';
  discription:string;

}
export interface galleries{
  even_name:string;
  cover_image:string;
  count:string;
}
interface Jobdetails {
  id: number;
  job_type: 'Job' | 'Internship'; // Enum for job types
  job_title: string;
  company_name: string;
  location: string;
  salary: string | null;
  stipend: string | null;
  deadline: string; // assuming date is returned as a string
  work_from_home: boolean | null;
  duration: string | null;
  start_date: string; // assuming date is returned as a string
  website_url: string | null;
  role_info: string;
  company_info: string;
  user_id: number | null;
  role: 'admin' | 'alumni';
  posted_date: string | null;
  status: 'inactive' | 'active';
}

  
export type jobs=job[];
export type alumnis=alumni[];