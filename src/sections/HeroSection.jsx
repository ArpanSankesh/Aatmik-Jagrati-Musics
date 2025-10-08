import { ChevronRightIcon, Radio } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center text-center bg-[url('/assets/hero-section-dot-image.png')] bg-cover bg-no-repeat">

            <h1 className="mt-28 md:mt-44 text-[40px]/12 md:text-[54px]/16 font-semibold max-w-3xl">
                Your Personal
                {" "}
                <span className="bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
                     Music
                </span>
                {" "}Classroom
            </h1>
            <p className="text-base text-slate-600 max-w-lg mt-5">
                Master your musical instrument with expert-led courses. Learn at your own pace with professional lessons and resources.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
                <button 
                    onClick={() => navigate('/courses')} 
                    className="flex gap-2 items-center justify-center bg-indigo-600 hover:bg-indigo-700 transition px-8 py-3 rounded-md text-white font-semibold shadow-md hover:shadow-lg"
                >
                    <ChevronRightIcon size={16} />
                    <span>View Courses</span>
                </button>
                
                <button 
                    onClick={() => navigate('/live-classes')} 
                    className="flex gap-2 items-center justify-center bg-red-500 hover:bg-red-600 transition px-8 py-3 rounded-md text-white font-semibold shadow-md hover:shadow-lg"
                >
                    <Radio size={16} />
                    <span>View Live Sessions</span>
                </button>
            </div>
            
            <div
                className="w-[90%] h-[300px] md:h-[600px] rounded-t-3xl mt-16 bg-cover bg-center object-cover"
                style={{ backgroundImage: "url('/assets/hero.jpg')" }}
            >
            </div>

        </div>
    );
}
