import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Courses from "./pages/Courses";
import Login from "./pages/Login";
import CourseDetailPage from "./pages/CourseDetailPage"; 
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Checkout from "./pages/Checkout"; // We will use one unified checkout
import PurchaseSuccess from "./pages/PurchaseSuccess";
import MyClassroom from "./pages/MyClassroom"; // Renamed for clarity
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCourses from "./pages/AdminCourses";
import CourseEditor from "./pages/CourseEditor";
import CourseInfoPage from "./pages/CourseInfoPage";

// --- NEW LIVE COURSE IMPORTS ---
import LiveClasses from "./pages/LiveClasses";
import LiveClassInfoPage from "./pages/LiveClassInfoPage";
import AdminLiveCourses from "./pages/AdminLiveCourses";
import LiveCourseEditor from "./pages/LiveCourseEditor";
import EnrolledLiveCoursePage from "./pages/EnrolledLiveCoursePage"; // Assuming you have this page

export default function App() {
  const pathname = useLocation().pathname;
  
  // Adjusted logic to hide layout on new pages as well
  const showLayout = ![
    "/login",
  ].includes(pathname) && !pathname.startsWith('/admin');

  return (
    <>
      {showLayout && <Navbar />}
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course/:courseId" element={<CourseInfoPage />} />
        <Route path="/live-classes" element={<LiveClasses />} />
        <Route path="/live-course/:courseId" element={<LiveClassInfoPage />} />
        
        {/* --- Protected Routes --- */}
        <Route path="/my-classroom" element={<ProtectedRoute><MyClassroom /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/courses/:courseId" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />
        <Route path="/enrolled/live-course/:courseId" element={<ProtectedRoute><EnrolledLiveCoursePage /></ProtectedRoute>} />
        <Route path="/purchase-success/:courseId" element={<ProtectedRoute><PurchaseSuccess /></ProtectedRoute>} />

        {/* --- UNIFIED CHECKOUT ROUTE --- */}
        <Route path="/checkout/:courseType/:courseId" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        
        {/* --- ADMIN ROUTES --- */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="create-course" element={<CourseEditor />} />
          <Route path="course/:courseId" element={<CourseEditor />} />
          {/* --- ADMIN LIVE COURSE ROUTES --- */}
          <Route path="live-courses" element={<AdminLiveCourses />} />
          <Route path="create-live-course" element={<LiveCourseEditor />} />
          <Route path="live-course/:courseId" element={<LiveCourseEditor />} />
        </Route>
      </Routes>
      {showLayout && <Footer />}
    </>
  );
}