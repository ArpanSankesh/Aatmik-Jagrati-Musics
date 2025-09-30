import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courses } from '../data/courseData';
import { useAuth } from '../context/AuthContext';
import { Lock } from 'lucide-react';

// A helper function to load a script dynamically
const loadScript = (src) => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

export default function Payment() {
    const { courseId } = useParams();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const course = courses.find(c => c.id === parseInt(courseId));

    useEffect(() => {
        loadScript('https://checkout.razorpay.com/v1/checkout.js');
    });

    const displayRazorpay = async () => {
        // IMPORTANT: In a real production app, the order creation (getting the order_id)
        // MUST happen on your backend (e.g., a Firebase Cloud Function) to prevent users
        // from manipulating the price.
        // For this example, we'll simulate it on the client-side.

        // 1. Create a dummy order on the backend (simulated here)
        // const orderData = await fetch('/api/create-order', { method: 'POST', body: JSON.stringify({ courseId }) });
        // const { order_id, amount, currency } = await orderData.json();

        const options = {
            key: "rzp_test_YOUR_KEY_ID", // <-- Replace with your Razorpay Key ID
            amount: "7900", // Amount is in currency subunits. 79 INR = 7900 paise.
            currency: "INR",
            name: "Aatmik Jagrati Musics",
            description: `Payment for ${course.title}`,
            image: "https://placehold.co/150x150/6366f1/ffffff?text=AJM", // Your Logo URL
            order_id: "order_DBJOWzybf0sJbb", // This should come from your backend
            handler: function (response) {
                // This function is called after a successful payment
                alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
                // Here you would verify the payment signature on your backend and then grant course access
                navigate('/courses');
            },
            prefill: {
                name: currentUser.displayName || 'New User',
                email: currentUser.email,
                contact: '9999999999' // Optional
            },
            notes: {
                course_id: course.id,
                user_id: currentUser.uid
            },
            theme: {
                color: "#4F46E5"
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    if (!course) {
        return <div className="text-center pt-32">Course not found.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20 pb-10">
            <div className="w-full max-w-4xl mx-auto p-4">
                <div className="bg-white rounded-lg shadow-2xl flex flex-col md:flex-row">
                    {/* Left Side: Course Details */}
                    <div className="md:w-1/2 p-8">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">Checkout Summary</h1>
                        <div className="flex items-center space-x-4">
                            <img src={course.imageUrl} alt={course.title} className="w-24 h-24 rounded-lg object-cover" />
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">{course.title}</h2>
                                <p className="text-gray-500 text-sm">By {course.instructor}</p>
                            </div>
                        </div>
                        <hr className="my-6" />
                        <div className="space-y-4 text-gray-700">
                             <div className="flex justify-between font-medium">
                                <span>Price</span>
                                <span>{course.price}</span>
                            </div>
                             <div className="flex justify-between font-medium text-gray-500 text-sm">
                                <span>Taxes & Fees</span>
                                <span>₹0.00</span>
                            </div>
                             <div className="flex justify-between font-bold text-xl text-gray-900 pt-2 border-t mt-4">
                                <span>Total Amount</span>
                                <span>{course.price}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Payment Button */}
                    <div className="md:w-1/2 bg-indigo-600 rounded-b-lg md:rounded-r-lg md:rounded-b-none p-8 flex flex-col justify-center items-center text-white">
                        <h2 className="text-2xl font-bold mb-4">Complete Your Purchase</h2>
                        <p className="text-center text-indigo-200 mb-6">Click the button below to proceed to our secure payment gateway.</p>
                        <button 
                            onClick={displayRazorpay}
                            className="w-full bg-white text-indigo-600 font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-transform duration-300 ease-in-out"
                        >
                            Pay Now ({course.price})
                        </button>
                        <div className="flex items-center mt-4 text-sm text-indigo-200">
                            <Lock size={14} className="mr-2" />
                            <span>Secure Payment via Razorpay</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
