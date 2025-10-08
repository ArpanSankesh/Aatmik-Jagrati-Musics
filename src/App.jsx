import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Courses from "./pages/Courses";
import Login from "./pages/Login";
import CourseDetailPage from "./pages/CourseDetailPage"; 
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Checkout from "./pages/Checkout";
import PurchaseSuccess from "./pages/PurchaseSuccess";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCourses from "./pages/AdminCourses";
import CourseEditor from "./pages/CourseEditor";
import CourseInfoPage from "./pages/CourseInfoPage";
import AdminLiveCourses from "./pages/AdminLiveCourses";
import LiveCourseEditor from "./pages/LiveCourseEditor";

// --- NEW PAGE IMPORTS ---
import LiveClasses from "./pages/LiveClasses";
import LiveClassInfoPage from "./pages/LiveClassInfoPage";
import MyClassroom from "./pages/MyClassroom"; // Renamed from MyCourses
import EnrolledLiveCoursePage from "./pages/EnrolledLiveCoursePage";


export default function App() {
  const pathname = useLocation().pathname;
  
  // This logic determines when to show the main Navbar and Footer.
  const showLayout = 
    pathname !== "/login" && 
    !pathname.startsWith('/course/') &&      // Regular course info page
    !pathname.startsWith('/live-course/') && // Live class info page
    !pathname.startsWith('/courses/') &&     // Enrolled regular course page
    !pathname.startsWith('/enrolled/') &&    // Enrolled live course page
    !pathname.startsWith('/checkout/') &&
    !pathname.startsWith('/purchase-success/') &&
    !pathname.startsWith('/admin');

  return (
    <>
      {showLayout && <Navbar />}

      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/live-classes" element={<LiveClasses />} /> {/* NEW */}

        <Route path="/course/:courseId" element={<CourseInfoPage />} />
        <Route path="/live-course/:courseId" element={<LiveClassInfoPage />} /> {/* NEW */}
        
        {/* --- Protected Routes --- */}
        <Route path="/my-classroom" element={<ProtectedRoute><MyClassroom /></ProtectedRoute>} /> {/* UPDATED */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        
        {/* UPDATED: Checkout route now handles 'course' or 'live' type */}
        <Route path="/checkout/:type/:courseId" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        
        <Route path="/purchase-success/:courseId" element={<ProtectedRoute><PurchaseSuccess /></ProtectedRoute>} />
        
        <Route path="/courses/:courseId" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />
        <Route path="/enrolled/live-course/:courseId" element={<ProtectedRoute><EnrolledLiveCoursePage /></ProtectedRoute>} /> {/* NEW */}

        {/* --- ADMIN ROUTES --- */}
        <Route 
            path="/admin"
            element={<AdminRoute><AdminLayout /></AdminRoute>}
        >
            <Route index element={<AdminDashboard />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="create-course" element={<CourseEditor />} />
            <Route path="course/:courseId" element={<CourseEditor />} />
            <Route path="live-courses" element={<AdminLiveCourses />} />
            <Route path="create-live-course" element={<LiveCourseEditor />} />
            <Route path="live-course/:courseId" element={<LiveCourseEditor />} />
        </Route>
      </Routes>

      {showLayout && <Footer />}
    </>
  );
}
