import { Dashboard, EventNote, PostAdd, Group, Menu, Close } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Sidebar = ({ isOpen, toggleSidebar }: { isOpen: boolean; toggleSidebar: () => void }) => {
  return (
    <div className={`fixed top-0 left-0 h-full bg-blue-900 text-white transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:w-64`}>
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="profile-pic-url" alt="Profile" className="w-10 h-10 rounded-full" />
          {isOpen && (
            <div>
              <h2 className="text-lg">John Doe</h2>
              <p className="text-sm text-green-400">john@doe.com</p>
            </div>
          )}
        </div>
        <button onClick={toggleSidebar} className="md:hidden">
          {isOpen ? <Close /> : <Menu />}
        </button>
      </div>
      <div className="mt-4">
        <h3 className="text-gray-400 px-4">General</h3>
        <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2 hover:bg-blue-700">
          <Dashboard /> {isOpen && 'Dashboard'}
        </Link>
        <div className="px-4 py-2 hover:bg-blue-700 cursor-pointer">
          <div className="flex items-center gap-3">
            <PostAdd /> {isOpen && 'Post Job'}
          </div>
        </div>
        <Link to="/events" className="flex items-center gap-3 px-4 py-2 hover:bg-blue-700">
          <EventNote /> {isOpen && 'View Events'}
        </Link>
        <Link to="/job-status" className="flex items-center gap-3 px-4 py-2 hover:bg-blue-700">
          <Group /> {isOpen && 'Status of Job Post'}
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
