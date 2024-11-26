

import { Suspense, lazy, useMemo } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  Outlet,
} from "react-router-dom";
import AlertProvider from "./components/Contex/AlertDetails";
import AlertDialogProvider from "./components/Contex/AlertDialogProvider";
import { Backdrop, CircularProgress } from "@mui/material";
import LoadingProvider from "./components/Contex/Loding";
import AuthProvider, { useAuth } from "./components/Auth/AuthProvider";
import PrivateRoute from "./components/Auth/PrivateRoute";
import PageLayout from "./components/Custom/PageLayout";
import Navbar1 from "./Guest/Navbar/Navbar";
import Footer from "./Guest/Footer/Footer"; // Assuming you have a Footer component
import Navbar from "./components/Custom/Navbar";
const Home = lazy(() => import("./Guest/Home"));
const About = lazy(() => import("./Guest/About"));
const Events = lazy(() => import("./Guest/Events"));
const Gallery = lazy(() => import("./Guest/Gallery"));
const Register = lazy(() => import("./Guest/Register"));
const Contact = lazy(() => import("./Guest/ContactUs"));
const LoginForm = lazy(() => import("./Guest/Login"));
const AlumniDashboard = lazy(() => import("./Alumni/Alumnidashboard"));
const AdminLogin = lazy(() => import("./Guest/AdminLogin"));
const AdminDashboard = lazy(() => import("./Admin/Admindashboard"));
import AddJob from "./Admin/Addjob";
import ManageJobs from "./Admin/ManageJobs";
import ManageAlumnis from "./Admin/ManageAlumnis";
import CreateEvent from "./Admin/CreateEvent";
import ErrorBoundary from "./components/Custom/ErrorBoundary";
import ApproveDialogProvider from "./components/Contex/ApproveDialogProvider";
import ViewJobs from "./Alumni/ViewJobs";
import ViewJob from "./Alumni/ViewJob";
import ViewAlumnis from "./Alumni/ViewAlumnis";
import AlumniDetailPage from "./Alumni/AlumniDetailPage";
import ViewEvents from "./Alumni/ViewEvents";
import ManageEvents from "./Admin/ManageEvents";
import ShowEvent from "./Alumni/ShowEvent";
import Addgallery from "./Admin/Addgallery";
import ViewGallery from "./Alumni/ViewGallery";
import ViewAlbum from "./Alumni/ViewAlbum";
import NewJobs from "./Admin/NewJobs";
import NewAlumnis from "./Admin/NewAlumnis";
import AddAdmin from "./Admin/AddAdmin";
import EditProfile from "./Alumni/EditProfile";

function App() {
   const authContext = useAuth();

  const nav = useMemo(() => (
    <Navbar 
      id={Number(authContext?.user?.id) || null} 
      role={authContext?.user?.role || ""}
    />
  ), [authContext]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
        <div className="min-h-screen flex flex-col">
        <Navbar1 />
        <div className="flex-grow">
          <PageLayout>
            <Outlet />
          </PageLayout>
          <Footer/>
        </div>
        
      </div>

      </>
      ),
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/events",
          element: <Events />,
        },
        {
          path: "/gallery",
          element: <Gallery />,
        },
        {
          path:"/gallery/:eventName",
          element:<ViewAlbum/>
        },
        {
          path:"/events/:id",
          element:<ShowEvent/>
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/contact",
          element: <Contact />,
        },{
          path: "/login",
          element: <LoginForm />
        },
        {
          path: "/adminlogin",
          element: <AdminLogin />
        },
      ],
    },
        {
          path: "/alumni",
          element: <>
           {nav}
           <PrivateRoute />
           </>,
          children: [
            {
              path: "/alumni/dashboard",
              element:<AlumniDashboard  />
            },{
              path:"/alumni/jobs/add Job",
              element:<AddJob />
            },{
              path:"/alumni/jobs/View Jobs",
              element:<ViewJobs/>
            },{
              path:"/alumni/jobs/:id",
              element:<ViewJob/>
            },{
              path:"/alumni/friends",
              element:<ViewAlumnis/>
            },
            {
              path:"/alumni/friends/:id",
              element:<AlumniDetailPage/>
            },{
              path:"/alumni/events",
              element:<ViewEvents/>
            },{
              path:"/alumni/events/:id",
              element:<ShowEvent/>
            },{
                path:"/alumni/gallery/view gallery",
                element:<ViewGallery/>
            },{
              path:"/alumni/gallery/:eventName",
              element:<ViewAlbum/>
            },{
              path:"/alumni/gallery/add images",
              element:<Addgallery/>
            },{
              path:"/alumni/edit-profile",
              element:<EditProfile/>
            },
          ]
        },
        {
          path: "/admin",
         
          element: <>
           {nav}
           <PrivateRoute />
           </>,
          children: [
            {
              path: "/admin/dashboard",
              element:<AdminDashboard  />
            },{
              path:"/admin/jobs/add Job",
              element:<AddJob />
            },{
              path: "/admin/jobs/Manage Jobs",
              element:<ManageJobs/>
            },{
              path: "/admin/jobs/New Jobs",
              element:<NewJobs/>
            },{
              path: "/admin/alumni/Manage Alumnis",
              element:<ManageAlumnis/>
            },{
              path: "/admin/alumni/New Alumnis",
              element:<NewAlumnis/>
            },{
              path: "/admin/Events/Add Event",
              element:<CreateEvent/>
            },{
              path: "/admin/Events/Manage Events",
              element:<ManageEvents/>
            },{
              path:"/admin/Gallery/add images",
              element:<Addgallery/>
            },
            {
              path:"/admin/admins/add admin",
              element:<AddAdmin/>
            },
            
          ]
        },
          
       
  ]);

  return (
    <Suspense
      fallback={
        <Backdrop
          sx={{ color: "#000", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      }
    >
      <LoadingProvider>
        <ErrorBoundary>
        <AlertProvider>
          <ApproveDialogProvider>
          <AlertDialogProvider>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
          </AlertDialogProvider>
          </ApproveDialogProvider>
        </AlertProvider>
        </ErrorBoundary>
      </LoadingProvider>
    </Suspense>
  );
}

export default App;

