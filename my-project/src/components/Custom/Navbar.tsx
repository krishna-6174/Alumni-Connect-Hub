import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PagesIcon from '@mui/icons-material/Pages';
import {
  Dashboard,
  EventNote,
  Group,
  InsertPhoto,
  PostAdd,
  Report,
  Menu,
  ArrowDropDown,
  ExpandLess,
  ExpandMore,
  Edit,
  Logout,
} from "@mui/icons-material";
import {
  Divider,
  Drawer,
  Popover,
  Tooltip,
  Typography,
  Collapse,
  Box,
  IconButton,
  Avatar,
  Grid,
  MenuItem,
} from "@mui/material";
import Cookies from "js-cookie";
import React from "react";
import { useAuth } from "../Auth/AuthProvider";
import {User} from "../../types"
export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();  // Initialize the navigate hook
  const pageLocation = pathname.split("/")[2] || "dashboard"; // Default to "dashboard" if no path
  const [openSideMenu, setOpenSideMenu] = useState(false);
  //const role = Cookies.get("role");
  const authContext = useAuth();
  const user: User | null |undefined= authContext?.user;
  const alumniNavLinks = [
    { name: "Dashboard", icon: <Dashboard /> },
    {
      name: "Events",
      icon: <EventNote />,
    },
    { name: "Friends", icon: <Group /> },
    {
      name: "Gallery",
      icon: <InsertPhoto />,
      dropdown: [{ name: "Add images"},{ name: "View gallery" } ],
     // , { name: "Albums" }
    },
    {
      name: "Jobs",
      icon: <PostAdd />,
      dropdown: [{ name: "Add Job" }, { name: "View Jobs" }],
      //, { name: "Applications" }
    },
  ];

  const adminNavLinks = [
    { name: "Dashboard", icon: <Dashboard /> },
    {
      name: "Gallery",
      icon: <InsertPhoto />,
      dropdown: [{ name: "Add Images" }],
      //, { name: "Manage Gallery" }, { name: "Categories" }
    },
    {
      name: "Jobs",
      icon: <PostAdd />,
      dropdown: [{ name: "Add Job" }, { name: "Manage Jobs" },{ name: "New Jobs" }],
      //, { name: "Reports" }
    },
    {
      name: "Alumni",
      icon: <Group />,
      dropdown: [ { name: "Manage Alumnis" },{ name: "New Alumnis" }],
      //, { name: "Statistics" },{ name: "Add Alumni" },
    },
    {
      name: "Events",
      icon: <EventNote />,
      dropdown: [{ name: "Add Event" }, { name: "Manage Events" }],
      //, { name: "Calendar" }
    },
    {
      name: "Admins",
      icon: <Group />,
      dropdown: [{ name: "Add Admin" }, { name: "Manage Admins" }],
      //, { name: "Permissions" }
    },
    { name: "Report", icon: <Report /> },
    // { name: "Pages", icon: <PagesIcon /> },
  ];
  if (!user?.role)
    navigate("/login");

  const userLinks = user?.role === "admin" ? adminNavLinks : alumniNavLinks;
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleDropdownToggle = (index: number) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const handleLinkClick = (path: string) => {
    navigate(path);  // Use navigate to redirect
  };

  const handleClickAway = useCallback(
    (event: MouseEvent) => {
      if (
        openDropdown !== null &&
        dropdownRefs.current[openDropdown] &&
        !dropdownRefs.current[openDropdown]?.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    },
    [openDropdown]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickAway);
    return () => {
      document.removeEventListener("mousedown", handleClickAway);
    };
  }, [handleClickAway]);

  return (
    <>
      <nav
        className="sticky top-0 w-full z-50 no-print"
        style={{
          backgroundColor: "#1E293B",
          backdropFilter: "blur(10px)",
          padding: "0.75rem 1.25rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "white",
        }}
      >
        <div className="flex items-center gap-4">
          <IconButton
            onClick={() => setOpenSideMenu(true)}
            className="rounded-full text-white hover:bg-blue-600 transition duration-300 lg:hidden"
          >
            <Menu fontSize="medium" />
          </IconButton>

          <div
            className={`hidden lg:flex items-center gap-4 ${
              openSideMenu ? "hidden" : "flex"
            }`}
          >
            {userLinks.map(({ name, icon, dropdown }, indx) => {
              const activePage = name.toLowerCase().replace(/\s+/g, "-");
              // console.log("active ---",activePage);
              // console.log("page loc a",pageLocation);
              const isActive =activePage === pageLocation;

              return (
                <div
                  key={indx}
                  className="relative"
                  ref={(el) => (dropdownRefs.current[indx] = el)}
                >
                  <button
                    onClick={() =>
                      dropdown
                        ? handleDropdownToggle(indx)
                        : handleLinkClick(`/${user?.role}/${activePage}`)
                    }  // Handle navigation if no dropdown
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition duration-300 ${
                      isActive ? "bg-blue-700 text-white" : "text-gray-300"
                    } hover:bg-blue-600 hover:text-white`}
                  >
                    {icon}
                    <span>{name}</span>
                    {dropdown && (
                      <ArrowDropDown
                        className={`transition-transform ${
                          openDropdown === indx ? "transform rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                  {dropdown && openDropdown === indx && (
                    <div className="absolute left-0 mt-2 w-48 bg-white text-black rounded-lg shadow-md z-50">
                      <Grid container direction="column">
                        {dropdown.map((item, index) => (
                          <Grid item key={index}>
                            <Link
                              to={`/${user?.role}/${activePage}/${item.name.toLowerCase()}`}
                              className={`block px-6 py-2 text-sm ${
                                pageLocation.includes(
                                  item.name.toLowerCase()
                                )
                                  ? "bg-gray-200"
                                  : ""
                              } hover:bg-gray-100`}
                              onClick={() => handleDropdownToggle(indx)}
                            >
                              {item.name}
                            </Link>
                          </Grid>
                        ))}
                      </Grid>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <UserMenu />
      </nav>
      <SideMenu
        openSideMenu={openSideMenu}
        setOpenSideMenu={setOpenSideMenu}
        userLinks={userLinks}
        pageLocation={pageLocation}
      />
    </>
  );
}
function SideMenu({
  openSideMenu,
  setOpenSideMenu,
  userLinks,
  pageLocation,
}: {
  openSideMenu: boolean;
  setOpenSideMenu: React.Dispatch<React.SetStateAction<boolean>>;
  userLinks: {
    name: string;
    icon: JSX.Element;
    dropdown?: { name: string }[];
  }[];
  pageLocation: string;
}) {
  const navigate = useNavigate();  // Initialize the navigate hook
  const [openCollapse, setOpenCollapse] = useState<number | null>(null);
  const authContext = useAuth();
  const user: User | null |undefined= authContext?.user;
  const handleCollapseToggle = (index: number) => {
    setOpenCollapse(openCollapse === index ? null : index);
  };

  const handleLinkClick = (path: string) => {
    setOpenSideMenu(false);
    setOpenCollapse(null);
    navigate(path);  // Use navigate to redirect
  };

  return (
    <Drawer
      anchor="left"
      open={openSideMenu}
      onClose={() => setOpenSideMenu(false)}
      sx={{
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: 260,
          backgroundColor: "#1E293B",
          color: "white",
        },
      }}
    >
      <Box role="presentation" sx={{ width: 260, paddingTop: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Navigation
        </Typography>
        <Divider sx={{ borderColor: "gray.500" }} />
        <Box sx={{ mt: 2 }}>
          {userLinks.map(({ name, icon, dropdown }, indx) => {
            const activePage = name.toLowerCase().replace(/\s+/g, "-");
            const isActive = activePage === pageLocation;

            return (
              <Box key={indx} sx={{ width: "100%" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2,
                    py: 1.5,
                    cursor: "pointer",
                    backgroundColor: isActive ? "#334155" : "transparent",
                    borderRadius: 1,
                    color: isActive ? "orange" : "#d1d5db" ,
                    "&:hover": {
                      backgroundColor: "#334155",
                    },
                  }}
                  onClick={() =>
                    dropdown
                      ? handleCollapseToggle(indx)
                      : handleLinkClick(`/${user?.role}/${activePage}`)
                  }  // Handle navigation if no dropdown
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    {icon}
                    <Typography variant="body1">{name}</Typography>
                  </Box>
                  {dropdown && (
                    <IconButton size="small">
                      {openCollapse === indx ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                    </IconButton>
                  )}
                </Box>
                {dropdown && (
                  <Collapse in={openCollapse === indx} timeout="auto" unmountOnExit>
                    <Box
                      sx={{
                        pl: 4,
                        pb: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      {dropdown.map((item, index) => (
                        <Typography
                          key={index}
                          variant="body2"
                          sx={{
                            p:1,
                            gap:1,
                            cursor: "pointer",
                            "&:hover": { color: "white",backgroundColor: "#334155",borderRadius: 1 },
                            color: pageLocation.includes(item.name.toLowerCase())
                              ? "white"
                              : "gray.300",
                          }}
                          onClick={() =>
                            handleLinkClick(`/${user?.role}/${activePage}/${item.name.toLowerCase()}`)
                          }
                        >
                          {item.name}
                        </Typography>
                      ))}
                    </Box>
                  </Collapse>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Drawer>
  );
}

function UserMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const authContext = useAuth();
  const user: User | null |undefined= authContext?.user;
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    Cookies.remove("auth_token");
    navigate("/login");
  };

  const handleEditProfile = () => {
    navigate(`/${user?.role}/edit-profile`);
  };

  // Assuming you store the email in sessionStorage
  const name = sessionStorage.getItem("name");
  const email = sessionStorage.getItem("email");
  const user_avatar=sessionStorage.getItem("user_avatar");
  return (
    <div className="flex items-center gap-2">
      <Tooltip title="Profile">
        <IconButton onClick={handleClick}>
        <Avatar alt={name} src={user_avatar} sx={{ width: 40, height: 40 }} />
        </IconButton>
      </Tooltip>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          className: "shadow-lg", // Add shadow effect using Tailwind CSS
          style: { borderRadius: 8 }, // Optional: Add border-radius for a smooth look
        }}
      >
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          {/* Display Name */}
          <Typography variant="body1" className="font-bold mb-1" sx={{color:'black',fontSize:20,fontWeight:'bold'}}>
            {name}
          </Typography>
          {/* Display Email */}
          <Typography variant="body2" className="text-black mb-2">
            {email}
          </Typography>
          
          {/* Divider Line */}
          <Divider className="my-2 w-full" />
          {/* Edit Profile Option */}
          <MenuItem
            onClick={handleEditProfile}
            className="flex items-center w-full text-gray-700 rounded transition-all duration-200"
            sx={{
              // color:'gray',
              "&:hover":{
                color:'white',
                background:'#1A4AC8',
                borderRadius: 1
              }
            }}
          >
            <Edit className="mr-2" />
            <Typography 
            variant="body2"
             >Edit Profile</Typography>
          </MenuItem>
          {/* Logout Option */}
          <MenuItem
            onClick={handleLogout}
            className="flex items-center w-full text-gray-700  hover:bg-indigo-500 rounded transition-all duration-200"
            sx={{
              // color:'gray',
              "&:hover":{
                color:'white',
                background:'#1A4AC8',
                borderRadius: 1
              }
            }}
          >
            <Logout className="mr-2" />
            <Typography variant="body2">Logout</Typography>
          </MenuItem>
        </Box>
      </Popover>
    </div>
  );
}
