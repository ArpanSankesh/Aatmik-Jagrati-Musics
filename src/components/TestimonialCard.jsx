export default function TestimonialCard({ testimonial }) {
    return (
        <div className="bg-white rounded-xl overflow-hidden mx-4 shadow-md hover:shadow-xl transition-all duration-300 w-80 shrink-0 border border-gray-100">
            {/* Large image at top */}
            <div className="relative overflow-hidden">
                <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-full h-52 object-cover transform hover:scale-105 transition-transform duration-300" 
                />
            </div>

            {/* Content section */}
            <div className="p-6">
                {/* Teacher name */}
                <h3 className="text-lg font-bold text-center text-gray-900 mb-2">
                    {testimonial.name}
                </h3>
                
                
            </div>
        </div>
    );
}
