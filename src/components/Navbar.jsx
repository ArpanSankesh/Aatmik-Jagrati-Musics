import { MenuIcon, XIcon, UserCircle, BookOpen } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const [openMobileMenu, setOpenMobileMenu] = useState(false);
    const [openProfileMenu, setOpenProfileMenu] = useState(false);
    const { currentUser, logout } = useAuth();
    const profileMenuRef = useRef(null);
    const navigate = useNavigate();

    // Effect to prevent scrolling when the mobile menu is open
    useEffect(() => {
        if (openMobileMenu) {
            document.body.classList.add("max-md:overflow-hidden");
        } else {
            document.body.classList.remove("max-md:overflow-hidden");
        }
    }, [openMobileMenu]);

    // Effect to close the profile dropdown when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setOpenProfileMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            setOpenProfileMenu(false); // Close dropdown
            navigate('/'); // Redirect to home after logout
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <nav className={`flex items-center justify-between fixed z-50 top-0 w-full px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-slate-200 bg-white/40 ${openMobileMenu ? 'bg-white/80' : 'backdrop-blur'}`}>
            <Link to="/">
                {/* <h1 className="font-extrabold text-2xl text-indigo-600">Aatmik jagrati musics</h1> */}
                <img src="./public/assets/logo.jpg" alt="Logo" className="h-10" />
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden items-center md:gap-8 lg:gap-9 font-medium md:flex">
                <NavLink to="/" className="hover:text-indigo-600 transition-colors">Home</NavLink>
                <NavLink to="/courses" className="hover:text-indigo-600 transition-colors">Courses</NavLink>
                {currentUser && (
                    <NavLink to="/my-courses" className="hover:text-indigo-600 transition-colors">My Courses</NavLink>
                )}
            </div>
            
            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 flex flex-col items-center justify-center gap-6 text-lg font-medium bg-white/80 backdrop-blur-md md:hidden transition duration-300 ${openMobileMenu ? "translate-x-0" : "-translate-x-full"}`}>
                <NavLink to="/" onClick={() => setOpenMobileMenu(false)}>Home</NavLink>
                <NavLink to="/courses" onClick={() => setOpenMobileMenu(false)}>Courses</NavLink>
                {currentUser && (
                    <NavLink to="/my-courses" onClick={() => setOpenMobileMenu(false)}>My Courses</NavLink>
                )}
                
                <div className="border-t border-gray-300 w-32 my-2"></div>

                {currentUser ? (
                    <>
                        <Link to="/profile" onClick={() => setOpenMobileMenu(false)} className="text-gray-800 hover:text-indigo-600">My Profile</Link>
                        <button 
                            onClick={() => { handleLogout(); setOpenMobileMenu(false); }} 
                            className="text-red-500 hover:text-red-700 font-medium"
                        >
                            Sign out
                        </button>
                    </>
                ) : (
                    <Link to="/login" onClick={() => setOpenMobileMenu(false)}>
                        <button className="font-medium px-6 py-2 border border-indigo-600 rounded-md transition hover:bg-slate-100">
                            Sign in
                        </button>
                    </Link>
                )}
                
                <button 
                    className="absolute top-6 right-6 aspect-square size-10 p-1 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-md" 
                    onClick={() => setOpenMobileMenu(false)}
                >
                    <XIcon />
                </button>
            </div>
            
            {/* Right side controls */}
            <div className="flex items-center gap-4">
                {currentUser ? (
                    // Profile Dropdown for logged-in users
                    <div className="relative" ref={profileMenuRef}>
                        <button onClick={() => setOpenProfileMenu(!openProfileMenu)} className="hidden md:block">
                            <UserCircle size={28} className="text-gray-600 hover:text-indigo-600" />
                        </button>
                        
                        {openProfileMenu && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm text-gray-500">Signed in as</p>
                                    <p className="font-medium text-gray-800 truncate">{currentUser.displayName || currentUser.email}</p>
                                </div>
                                <div className="py-1">
                                    <Link 
                                        to="/my-courses" 
                                        onClick={() => setOpenProfileMenu(false)}
                                        className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                                    >
                                        <BookOpen size={16} /> My Courses
                                    </Link>
                                    <Link 
                                        to="/profile" 
                                        onClick={() => setOpenProfileMenu(false)}
                                        className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                                    >
                                        <UserCircle size={16} /> My Profile
                                    </Link>
                                </div>
                                <div className="border-t border-gray-100 py-1">
                                    <button 
                                        onClick={handleLogout} 
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    // Sign in button for guests
                    <Link to="/login">
                        <button className="hidden md:block hover:bg-slate-100 transition px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md font-medium">
                            Sign in
                        </button>
                    </Link>
                )}
                
                {/* Mobile Menu Button */}
                <button onClick={() => setOpenMobileMenu(!openMobileMenu)} className="md:hidden">
                    <MenuIcon size={26} className="active:scale-90 transition" />
                </button>
            </div>
        </nav>
    );
}

