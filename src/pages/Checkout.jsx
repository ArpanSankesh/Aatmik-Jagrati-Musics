import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Lock } from 'lucide-react';
import { doc, getDoc, setDoc, arrayUnion, Timestamp } from 'firebase/firestore';
import { db } from '../Config/firebaseConfig';

// NOTE: The Razorpay loadScript function is no longer needed for this test file.

export default function Checkout() {
    const { courseType, courseId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [processingPayment, setProcessingPayment] = useState(false);

    useEffect(() => {
        const initialize = async () => {
            if (!courseId || !courseType) {
                setError("Invalid checkout link.");
                setLoading(false);
                return;
            }

            const collectionName = courseType === 'live' ? 'liveCourses' : 'courses';

            try {
                const courseDocRef = doc(db, collectionName, courseId);
                const courseDocSnap = await getDoc(courseDocRef);

                if (courseDocSnap.exists()) {
                    setCourse({ id: courseDocSnap.id, ...courseDocSnap.data() });
                } else {
                    setError("Course not found.");
                }
            } catch (err) {
                console.error("Error fetching course:", err);
                setError("Failed to load course details.");
            } finally {
                setLoading(false);
            }
        };
        initialize();
    }, [courseId, courseType]);

    // --- THIS IS THE FAKE CHECKOUT FUNCTION ---
    const handleFakeCheckout = async () => {
        if (!course || !currentUser) return;
        setProcessingPayment(true);
        setError('');

        try {
            console.log("Simulating successful payment...");

            // Determine which field to update in the user's document
            const enrollmentField = courseType === 'live' ? 'enrolledLiveCourses' : 'enrolledCourses';

            // Calculate expiry date
            const validityDays = course.validityDays ? parseInt(course.validityDays) : null;
            let expiryDateObject = new Date();
            
            if (validityDays && validityDays > 0) {
                expiryDateObject.setDate(expiryDateObject.getDate() + validityDays);
            } else {
                expiryDateObject.setFullYear(expiryDateObject.getFullYear() + 100);
            }

            // Create the enrollment object
            const newEnrolledCourse = {
                courseId: course.id,
                purchaseDate: Timestamp.now(),
                expiryDate: Timestamp.fromDate(expiryDateObject),
                paymentId: `fake_payment_${Date.now()}` // Add a fake payment ID
            };

            // Directly update the Firestore database
            const userDocRef = doc(db, 'users', currentUser.uid);
            await setDoc(userDocRef, {
                [enrollmentField]: arrayUnion(newEnrolledCourse),
            }, { merge: true });
            
            console.log("Firestore updated successfully.");

            // Navigate to the success page
            navigate(`/purchase-success/${course.id}`);

        } catch (err) {
            console.error("Error during fake checkout:", err);
            setError("Failed to simulate enrollment.");
            setProcessingPayment(false);
        }
    };
    
    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading Checkout...</div>;
    }

    if (!course) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-red-600">Item Not Found</h1>
                    <p className="text-gray-600 mt-2">{error}</p>
                    <Link to="/courses" className="mt-6 inline-block bg-indigo-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-indigo-700 transition">
                        Go back to Courses
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-8">
                <div className="bg-white shadow-2xl rounded-2xl p-8">
                    <Link to={courseType === 'live' ? '/live-classes' : '/courses'} className="flex items-center text-sm text-gray-500 hover:text-indigo-600 mb-6">
                        <ArrowLeft size={16} className="mr-2" />
                        Back to {courseType === 'live' ? 'Live Classes' : 'Courses'}
                    </Link>
                    <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">Order Summary</h2>

                    <div className="border-b border-gray-200 pb-6">
                        <div className="flex items-start space-x-5">
                            <img src={course.imageUrl} alt={course.title} className="w-28 h-28 rounded-lg object-cover shadow-md" />
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-800">{course.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">By {course.instructor}</p>
                                <p className="text-2xl font-extrabold text-indigo-600 mt-4">{course.price}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-6">
                        <dl className="space-y-4">
                            <div className="flex justify-between items-center">
                                <dt className="text-lg font-medium text-gray-600">Total</dt>
                                <dd className="text-xl font-bold text-gray-900">{course.price}</dd>
                            </div>
                        </dl>
                    </div>

                    {error && (
                        <div className="my-4 p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="mt-8">
                        <button
                            onClick={handleFakeCheckout} // <-- This now calls the fake checkout function
                            disabled={processingPayment}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                        >
                            {processingPayment ? 'Processing...' : `(TEST) Enroll in ${course.price}`}
                        </button>
                        <p className="mt-4 text-xs text-gray-500 text-center flex items-center justify-center">
                            <Lock size={12} className="mr-1.5" />
                            This is for testing purposes only
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}