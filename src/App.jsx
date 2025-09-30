import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Courses from "./pages/Courses";
import Login from "./pages/Login";
import CourseDetailPage from "./pages/CourseDetailPage"; 
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Payment from "./pages/Payment";

export default function App() {
  const pathname = useLocation().pathname;

  // This condition now correctly shows the layout on the profile page,
  // while hiding it on the login, course detail, and checkout pages.
  const showLayout = 
    pathname !== "/login" && 
    !pathname.startsWith('/courses/') &&
    !pathname.startsWith('/course/'); // This covers the checkout page

  return (
    <>
      {showLayout && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<Courses />} />
        
        {/* This route for the detail page has no layout */}
        <Route path="/courses/:courseId" element={<CourseDetailPage />} />

        {/* Protected Routes */}
        <Route 
          path="/profile" 
          element={<ProtectedRoute><Profile /></ProtectedRoute>} 
        />
        <Route 
          path="/course/:courseId/checkout" 
          element={<ProtectedRoute><Payment /></ProtectedRoute>} 
        />
      </Routes>

      {showLayout && <Footer />}
    </>
  );
}