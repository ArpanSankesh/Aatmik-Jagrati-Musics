import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock } from 'lucide-react';
import { doc, getDoc, setDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '../Config/firebaseConfig';

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
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourseAndLoadScript = async () => {
            setLoading(true);
            await loadScript('https://checkout.razorpay.com/v1/checkout.js');
            if (courseId) {
                const courseDocRef = doc(db, 'courses', courseId);
                const courseDocSnap = await getDoc(courseDocRef);
                if (courseDocSnap.exists()) {
                    setCourse({ id: courseDocSnap.id, ...courseDocSnap.data() });
                }
            }
            setLoading(false);
        };
        fetchCourseAndLoadScript();
    }, [courseId]);

    const displayRazorpay = async () => {
        if (!course) return;

        // In a real app, order creation MUST happen on your backend.
        const options = {
            key: "rzp_test_YOUR_KEY_ID", // <-- Replace with your Razorpay Key ID
            amount: "7900", 
            currency: "INR",
            name: "Aatmik Jagrati Musics",
            description: `Payment for ${course.title}`,
            image: "https://placehold.co/150x150/6366f1/ffffff?text=AJM",
            order_id: "order_DBJOWzybf0sJbb",
            
            // --- UPDATED HANDLER FUNCTION ---
            handler: async function (response) {
                console.log("Payment successful:", response);
                try {
                    // This logic now runs AFTER a successful payment
                    const validityDays = course.validityDays ? parseInt(course.validityDays) : null;
                    let expiryDate = null;

                    if (validityDays && validityDays > 0) {
                        const purchaseDate = new Date();
                        expiryDate = new Date(purchaseDate.setDate(purchaseDate.getDate() + validityDays));
                    } else {
                        const purchaseDate = new Date();
                        expiryDate = new Date(purchaseDate.setFullYear(purchaseDate.getFullYear() + 100));
                    }

                    const newEnrolledCourse = {
                        courseId: course.id,
                        expiryDate: expiryDate,
                        purchaseDate: serverTimestamp(),
                        paymentId: response.razorpay_payment_id // Good practice to save payment ID
                    };

                    const userDocRef = doc(db, 'users', currentUser.uid);
                    await setDoc(userDocRef, {
                        enrolledCourses: arrayUnion(newEnrolledCourse)
                    }, { merge: true });

                    // Navigate to a success page
                    navigate(`/purchase-success/${course.id}`);

                } catch (err) {
                    console.error("Error saving enrollment after payment:", err);
                    // Optionally navigate to an error page
                    alert("Payment was successful, but we had an issue enrolling you. Please contact support.");
                }
            },
            prefill: {
                name: currentUser.displayName || 'New User',
                email: currentUser.email,
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

    if (loading) {
        return <div className="text-center pt-32">Loading payment details...</div>;
    }
    
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