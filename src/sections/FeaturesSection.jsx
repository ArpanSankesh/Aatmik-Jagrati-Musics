import SectionTitle from "../components/SectionTitle";

export default function FeaturesSection() {
    const features = [
        {
            title: "🎥 HD Video Lessons",
            desc: "Step-by-step piano tutorials designed for beginners and intermediate learners.",
            img: "/assets/online-class.jpg",
        },
        {
            title: "📊 Progress Tracking",
            desc: "Stay motivated with real-time progress tracking and lesson completion stats.",
            img: "/assets/progress.jpg",
        },
        {
            title: "📑 Downloadable Notes",
            desc: "Access sheet music and practice exercises anytime to reinforce your learning.",
            img: "/assets/notes.jpg",
        },
        {
            title: "🔒 Secure Learning",
            desc: "Encrypted streaming with anti-piracy protection to keep your lessons safe.",
            img: "/assets/Hero.jpg",
        },
        {
            title: "💬 Doubt Support",
            desc: "Get your questions answered quickly through our doubt support system.",
            img: "/assets/doubt.png",
        },
    ];

    return (
        <>
            <SectionTitle 
                text1="Features" 
                text2="Why Learn With Us?" 
                text3="Everything you need to master the piano in one secure, easy-to-use platform." 
            />

            <div className="flex flex-wrap items-center justify-center gap-10 px-10 mt-5">
                {features.map((feature, index) => (
                    <div key={index} className="max-w-80 hover:-translate-y-0.5 transition duration-300">
                        {/* Background image div */}
                        <div 
                            className="h-60 rounded-xl bg-cover bg-center  shadow-md"
                            style={{ backgroundImage: `url(${feature.img})` }}
                        ></div>

                        {/* Text outside the image */}
                        <h3 className="text-base font-semibold text-slate-700 mt-4">{feature.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </>
    );
}
