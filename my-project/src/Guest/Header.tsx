import { ArrowDropDown, Menu } from '@mui/icons-material';

const Header = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  return (
    <div className="flex justify-between items-center bg-blue-900 text-white px-6 py-3">
      <button onClick={toggleSidebar} className="md:hidden">
        <Menu />
      </button>
      <h1 className="text-xl font-bold">COLLEGE ALUMNI SYSTEM</h1>
      <div className="flex items-center gap-2">
        <img src="profile-pic-url" alt="Profile" className="w-8 h-8 rounded-full" />
        <span>John Doe</span>
        <ArrowDropDown />
      </div>
    </div>
  );
};

export default Header;

