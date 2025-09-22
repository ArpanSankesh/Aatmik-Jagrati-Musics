import { MenuIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

export default function Navbar() {
    const [openMobileMenu, setOpenMobileMenu] = useState(false);
    const pathname = useLocation().pathname;

    useEffect(() => {
        if (openMobileMenu) {
            document.body.classList.add("max-md:overflow-hidden");
        } else {
            document.body.classList.remove("max-md:overflow-hidden");
        }
    }, [openMobileMenu]);

    return (
        <nav className={`flex items-center justify-between fixed z-50 top-0 w-full px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-slate-200 bg-white/40 ${openMobileMenu ? 'bg-white/80' : 'backdrop-blur'}`}>
            <Link to="/">
                <h1 className="font-extrabold text-2xl text-indigo-600 hover:text-indigo-600" >Aatmik jagrati musics</h1>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden items-center md:gap-8 lg:gap-9 font-medium md:flex lg:pl-20">
                <NavLink to="/" className="hover:text-indigo-600">Home</NavLink>
                <NavLink to="/courses" className="hover:text-indigo-600">Courses</NavLink>
            </div>
            
            {/* Mobile menu */}
            <div className={`fixed inset-0 flex flex-col items-center justify-center gap-6 text-lg font-medium bg-white/40 backdrop-blur-md md:hidden transition duration-300 ${openMobileMenu ? "translate-x-0" : "-translate-x-full"}`}>
                <NavLink to="/" onClick={() => setOpenMobileMenu(false)}>Home</NavLink>
                <NavLink to="/courses" onClick={() => setOpenMobileMenu(false)}>Courses</NavLink>
                <Link to="/login" onClick={() => setOpenMobileMenu(false)}>
                    <button className="text-gray-800 hover:text-indigo-600">Sign in</button>
                </Link>
                <button 
                    className="aspect-square size-10 p-1 items-center justify-center bg-indigo-600 hover:bg-indigo-700 transition text-white rounded-md flex" 
                    onClick={() => setOpenMobileMenu(false)}>
                    <XIcon />
                </button>
            </div>
            
            <div className="flex items-center gap-4">
                <Link to="/login">
                    <button className="hidden md:block hover:bg-slate-100 transition px-4 py-2 border border-indigo-600 rounded-md">
                        Sign in
                    </button>
                </Link>
                <button onClick={() => setOpenMobileMenu(!openMobileMenu)} className="md:hidden">
                    <MenuIcon size={26} className="active:scale-90 transition" />
                </button>
            </div>
        </nav>
    );
}