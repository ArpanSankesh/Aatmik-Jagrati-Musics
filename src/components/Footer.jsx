import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="px-6 md:px-16 lg:px-24 xl:px-32 mt-40 w-full text-slate-500 border-t-1 border-gray-200 pt-5">
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-200 pb-6">
                <div className="md:max-w-114">
                    <Link to="/">
                        <h1 className="font-extrabold text-2xl text-indigo-600 hover:text-indigo-600">Aatmik jagrati musics</h1>
                    </Link>
                    <p className="mt-6">
                        Empowering students with high-quality, secure online courses. Our platform provides a seamless learning experience, from easy enrollment to a dedicated student portal and a robust admin panel for content management.
                    </p>
                </div>
                <div className="flex-1 flex items-start md:justify-end gap-20">
                    <div>
                        <h2 className="font-semibold mb-5 text-gray-800">Platform</h2>
                        <ul className="space-y-2">
                            <li><Link to="/" className="hover:text-indigo-600">Home</Link></li>
                            <li><Link to="/courses" className="hover:text-indigo-600">Courses</Link></li>
                            <li><Link to="/login" className="hover:text-indigo-600">Student Login</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-5 text-gray-800">Support</h2>
                        <div className="space-y-2">
                            <p>+91 96911 48602</p>
                            <p>Aatmikjagratimusics714@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
            <p className="pt-4 text-center pb-5">
                Copyright 2025 © ABHISHEK. All Rights Reserved.
            </p>
        </footer>
    );
}