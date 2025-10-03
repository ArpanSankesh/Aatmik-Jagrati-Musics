import { ChevronRightIcon, SparklesIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center text-center bg-[url('/assets/hero-section-dot-image.png')] bg-cover bg-no-repeat">

            <h1 className="mt-28 md:mt-44 text-[40px]/12 md:text-[54px]/16 font-semibold max-w-3xl ">
                Learn to Piano Online &
                {" "}
                <span className="bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
                    Master Your
                </span>
                {" "}Music Skills
            </h1>
            <p className="text-base text-slate-600 max-w-lg mt-5">Step-by-step lessons, interactive exercises, and expert guidance.
                Perfect for beginners and intermediate players.</p>
            <div className="flex items-center gap-4 mt-6">
                
                <button onClick={() => navigate('/courses')} className="flex gap-2 items-center justify-center bg-indigo-600 hover:bg-indigo-700 transition px-8 py-3 rounded-md text-white">
                    <ChevronRightIcon size={16} />
                    <span>View Course</span>
                </button>
            </div>
            <div
                className="w-[90%] h-[300px] md:h-[500px] rounded-t-3xl mt-16  bg-cover bg-center object-cover"
                style={{ backgroundImage: "url('/assets/hero2.jpg')" }}
            >
            </div>

        </div>
    );
}