// types.d.ts
export interface User {
    id: number;
    role: string;
  }
export interface Alumni{
    id: number;              // Primary key, auto_increment
    profile?: string | null; // Profile picture or URL
    fullName: string;            // Alumni name
    gender?: 'MALE' | 'FEMALE' | 'OTHER' | null; // Enum for gender
    rollNo: string;          // Primary key for Roll number
    email: string;           // Primary key for email
    password?: string | null; // Encrypted password
    department?: string | null;    // Department
    passedOutYear?: number | null;     // Passing out year
    job_status?: string | null; // Current job status
    interest?: string | null; // Alumni's interests
    companyname?: string | null; // Current company name
    loc?: string | null;     // Location
    role?: string | null;    // Role of the alumni
    myself?: string | null;  // Description text about themselves
    status?: 'active' | 'inactive'; // Status of the alumni account
  }

  // Job interface representing the structure of the 'jobs' table
export interface Job {
  id: number;
  job_type: 'Job' | 'Internship'; // Enum representing the type of job (Job or Internship)
  job_title: string;              // Job title
  company_name: string;           // Company name
  location: string;               // Job location
  salary: string | null;          // Salary for the job (nullable)
  stipend: string | null;         // Stipend for internships (nullable)
  deadline: string | null;        // Application deadline (nullable)
  duration: string | null;        // Duration of the job or internship (nullable)
  start_date: string | null;      // Start date for the job/internship (nullable)
  website_url: string | null;     // Company website URL (nullable)
  role_info: string | null;       // Job or internship role information (HTML content, nullable)
  company_info: string | null;    // Information about the company (HTML content, nullable)
  user_id: number;                // User ID who posted the job
  role: 'admin' | 'alumni';       // Role of the person posting (admin or alumni)
  posted_date: string | null;     // Date the job was posted (nullable)
  status: 'inactive' | 'active';  // Status of the job (active or inactive)
}
