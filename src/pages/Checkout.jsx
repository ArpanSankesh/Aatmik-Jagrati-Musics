import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Lock } from 'lucide-react';
import { doc, setDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '../Config/firebaseConfig';

export default function Checkout() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourse = async () => {
            if (!courseId) {
                setLoading(false);
                return;
            }
            try {
                const courseDocRef = doc(db, 'courses', courseId);
                const courseDocSnap = await getDoc(courseDocRef);
                if (courseDocSnap.exists()) {
                    setCourse({ id: courseDocSnap.id, ...courseDocSnap.data() });
                }
            } catch (err) {
                console.error("Error fetching course:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [courseId]);

    const handleConfirmPurchase = async () => {
        if (!currentUser) {
            setError("You must be logged in to enroll.");
            return;
        }
        setLoading(true);
        setError('');
        try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            
            // --- THIS IS THE FIX ---
            // We now save the courseId directly as a string, without parseInt()
            await setDoc(userDocRef, {
                purchasedCourses: arrayUnion(courseId) 
            }, { merge: true });
            
            navigate(`/purchase-success/${course.id}`);
        } catch (err) {
            console.error("Error saving purchase: ", err);
            setError("Failed to process your enrollment. Please try again.");
            setLoading(false);
        }
    };
    
    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading details...</div>;
    }

    if (!course) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Course Not Found</h1>
                    <Link to="/courses" className="mt-4 text-indigo-600 hover:underline">
                        Go back to courses
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-8">
                <div className="bg-white shadow-2xl rounded-2xl p-8">
                    <Link to="/courses" className="flex items-center text-sm text-gray-500 hover:text-indigo-600 mb-6">
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Courses
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
                            onClick={handleConfirmPurchase}
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : 'Confirm & Enroll'}
                        </button>
                        <p className="mt-4 text-xs text-gray-500 text-center flex items-center justify-center">
                            <Lock size={12} className="mr-1.5" />
                            Your enrollment will be saved to your account
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}