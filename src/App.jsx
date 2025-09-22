import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Courses from "./pages/Courses";
import Login from "./pages/Login";

export default function App() {
  const pathname = useLocation().pathname;

  return (
    <>
      {pathname !== "/login" && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/courses" element={<Courses />} />
      </Routes>

      {pathname !== "/login" && <Footer />}
    </>
  );
}
