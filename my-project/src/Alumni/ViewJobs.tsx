import React, { useEffect, useState } from 'react';
import JobCard from '../components/Custom/JobCard';
import axios from 'axios';
import { Container, Box, Typography, Grid, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface Jobforcards {
  id: number;
  job_type: 'Job' | 'Internship';
  job_title: string;
  company_name: string;
  location: string;
  salary?: string;
  stipend?: string;
  deadline: string;
  posted_date: string;
  role: 'admin' | 'alumni';
  user_name: string;
  user_avatar: string;
}

const ViewJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Jobforcards[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Jobforcards[]>([]);
  const [jobTitleInput, setJobTitleInput] = useState('');
  const [companyNameInput, setCompanyNameInput] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await axios.get('/api/alumni/jobsforcards', {
          withCredentials: true,
        });
        setJobs(response.data.jobsforcard);
        setFilteredJobs(response.data.jobsforcard);
      } catch (error) {
        console.log('Error fetching jobs: ', error);
      }
    }
    fetchJobs();
  }, []);

  // Handle search by job title
  const handleJobTitleSearch = () => {
    const filtered = jobs.filter(job =>
      job.job_title.toLowerCase().includes(jobTitleInput.toLowerCase())
    );
    setFilteredJobs(filtered);
    setJobTitleInput('');
  };

  // Handle search by company name
  const handleCompanyNameSearch = () => {
    const filtered = jobs.filter(job =>
      job.company_name.toLowerCase().includes(companyNameInput.toLowerCase())
    );
    setFilteredJobs(filtered);
    setCompanyNameInput('');
  };

  // Handle category filtering (All, Job, Internship)
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    if (category === 'all') {
      setFilteredJobs(jobs);
    } else {
      setFilteredJobs(jobs.filter(job => job.job_type === category));
    }
  };

  const jobCategories = [
    { label: 'All Jobs', count: jobs.length, category: 'all' },
    { label: 'Jobs', count: jobs.filter(job => job.job_type === 'Job').length, category: 'Job' },
    { label: 'Internships', count: jobs.filter(job => job.job_type === 'Internship').length, category: 'Internship' },
  ];

  return (
    <Container maxWidth="lg" className="m-10 mx-auto p-6 bg-gray-50">
      <div className="sm:flex h-screen">
        {/* Left Sidebar - Search & Categories */}
        <div className="sm:w-1/4 p-4">
          {/* Search Bar for Job Title */}
          <div className="relative w-full mb-4">
            <input
              type="text"
              placeholder="Search by job title..."
              value={jobTitleInput}
              onChange={(e) => setJobTitleInput(e.target.value)}
              className="w-full border border-gray-300 p-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button onClick={handleJobTitleSearch} className="absolute right-3 top-2">
              <SearchIcon className="text-gray-500" />
            </button>
          </div>

          {/* Search Bar for Company Name */}
          <div className="relative w-full mb-4">
            <input
              type="text"
              placeholder="Search by company name..."
              value={companyNameInput}
              onChange={(e) => setCompanyNameInput(e.target.value)}
              className="w-full border border-gray-300 p-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button onClick={handleCompanyNameSearch} className="absolute right-3 top-2">
              <SearchIcon className="text-gray-500" />
            </button>
          </div>

          {/* Job Categories */}
          <h3 className="font-bold mb-4">JOB CATEGORIES</h3>
          <ul className="space-y-2">
            {jobCategories.map((category) => (
              <li
                key={category.category}
                className={`cursor-pointer p-2 rounded-lg ${activeCategory === category.category ? 'bg-indigo-400' : 'bg-gray-200'} hover:bg-indigo-300`}
                onClick={() => handleCategoryClick(category.category)}
              >
                <div className="flex justify-between">
                  <span>{category.label}</span>
                  <span>({category.count})</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content - Job Cards */}
        <div className="sm:w-3/4">
          <Box className="p-6 bg-gray-50 min-w-md">
            <Typography variant="h4" className="font-bold mb-8 p-10">
              {activeCategory === 'all'
                ? 'All Jobs'
                : activeCategory === 'Job'
                ? 'Jobs'
                : 'Internships'}
            </Typography>

            <Grid container spacing={4}>
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <Grid item key={job.id} xs={12} sm={12} md={12} sx={{ padding: 2, background: 'grey.100' }}>
                    <JobCard {...job} />
                  </Grid>
                ))
              ) : (
                <div className="pt-5 text-green-800 text-center font-medium text-2xl w-full">
                  No jobs found.
                </div>
              )}
            </Grid>
          </Box>
        </div>
      </div>
    </Container>
  );
};

export default ViewJobs;
