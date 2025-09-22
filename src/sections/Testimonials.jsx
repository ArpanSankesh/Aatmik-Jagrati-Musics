import Marquee from "react-fast-marquee";
import TestimonialCard from "../components/TestimonialCard";
import { testimonialsData } from "../data/testimonialsData";
import SectionTitle from "../components/SectionTitle";

export default function Testimonials() {
    return (
        <>
            <SectionTitle
                text1="Student Testimonials"
                text2="Hear From Our Learners"
                text3="Real experiences from students who transformed their piano skills with our step-by-step course."
            />


            <Marquee className="max-w-5xl mx-auto mt-11" gradient={true} speed={25}>
                <div className="flex items-center justify-center py-5">
                    {[...testimonialsData, ...testimonialsData].map((testimonial, index) => (
                        <TestimonialCard key={index} testimonial={testimonial} />
                    ))}
                </div>
            </Marquee>
            <Marquee className="max-w-5xl mx-auto" gradient={true} speed={25} direction="right">
                <div className="flex items-center justify-center py-5">
                    {[...testimonialsData, ...testimonialsData].map((testimonial, index) => (
                        <TestimonialCard key={index} testimonial={testimonial} />
                    ))}
                </div>
            </Marquee>
        </>
    );
}