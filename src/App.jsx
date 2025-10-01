import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar"; // <-- This was the missing import
import Footer from "./components/Footer";
import Courses from "./pages/Courses";
import Login from "./pages/Login";
import CourseDetailPage from "./pages/CourseDetailPage"; 
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Checkout from "./pages/Checkout";
import PurchaseSuccess from "./pages/PurchaseSuccess";
import MyCourses from "./pages/MyCourses";
import AdminRoute from "./components/AdminRoute";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCourses from "./pages/AdminCourses";
import CourseEditor from "./pages/CourseEditor";

export default function App() {
  const pathname = useLocation().pathname;
  
  const showLayout = 
    pathname !== "/login" && 
    !pathname.startsWith('/courses/') &&
    !pathname.startsWith('/checkout/') &&
    !pathname.startsWith('/purchase-success/') &&
    !pathname.startsWith('/admin');

  return (
    <>
      {showLayout && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<Courses />} />
        
        {/* Protected Routes */}
        <Route path="/my-courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/checkout/:courseId" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/purchase-success/:courseId" element={<ProtectedRoute><PurchaseSuccess /></ProtectedRoute>} />
        <Route path="/courses/:courseId" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />

        {/* ADMIN ROUTES */}
        <Route 
            path="/admin"
            element={<AdminRoute><AdminLayout /></AdminRoute>}
        >
            <Route index element={<AdminDashboard />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="create-course" element={<CourseEditor />} />
            <Route path="course/:courseId" element={<CourseEditor />} />
        </Route>
      </Routes>

      {showLayout && <Footer />}
    </>
  );
}