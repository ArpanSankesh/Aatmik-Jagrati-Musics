import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
// NEW: Import Firestore functions to fetch data
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Config/firebaseConfig';

export default function PurchaseSuccess() {
    const { courseId } = useParams();
    
    // NEW: State to hold the course fetched from Firebase
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    // NEW: useEffect to fetch the course data from Firestore
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
                } else {
                    console.log("No such course found in Firestore!");
                }
            } catch (err) {
                console.error("Error fetching course:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId]);

    // Show a loading state while fetching
    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    // This now correctly handles the case where the course isn't found
    if (!course) {
        return (
             <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold">An Error Occurred</h1>
                    <p className="text-gray-600">We couldn't find the course you enrolled in.</p>
                    <Link to="/courses" className="mt-4 text-indigo-600 hover:underline">
                        Go back to courses
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full text-center bg-white p-10 rounded-xl shadow-lg">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                <h1 className="mt-6 text-3xl font-extrabold text-gray-900">Enrollment Successful!</h1>
                <p className="mt-4 text-gray-600">
                    You have successfully enrolled in:
                </p>
                <p className="mt-2 text-xl font-bold text-indigo-600">
                    {course.title}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                    <Link
                        to={`/courses/${course.id}`}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Start Learning Now
                    </Link>
                    <Link
                        to="/my-courses"
                        className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Go to My Courses
                    </Link>
                </div>
            </div>
        </div>
    );
}