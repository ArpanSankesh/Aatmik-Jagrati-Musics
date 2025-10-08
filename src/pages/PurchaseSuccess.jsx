import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Config/firebaseConfig';
import { CheckCircle, ArrowRight } from 'lucide-react';

export default function PurchaseSuccess() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [courseType, setCourseType] = useState('course'); // 'course' or 'live'

    useEffect(() => {
        const fetchCourseDetails = async () => {
            if (!courseId) {
                setLoading(false);
                return;
            }
            try {
                // 1. Try to fetch from the 'courses' collection first
                let courseRef = doc(db, 'courses', courseId);
                let courseSnap = await getDoc(courseRef);

                if (courseSnap.exists()) {
                    setCourse({ id: courseSnap.id, ...courseSnap.data() });
                    setCourseType('course'); // It's a regular course
                } else {
                    // 2. If not found, try to fetch from the 'liveCourses' collection
                    courseRef = doc(db, 'liveCourses', courseId);
                    courseSnap = await getDoc(courseRef);
                    if (courseSnap.exists()) {
                        setCourse({ id: courseSnap.id, ...courseSnap.data() });
                        setCourseType('live'); // It's a live course
                    }
                }
            } catch (error) {
                console.error("Error fetching course details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseDetails();
    }, [courseId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center p-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">An Error Occurred</h1>
                    <p className="text-gray-600 mt-2">We couldn't find the course you enrolled in.</p>
                    <Link to="/courses" className="text-indigo-600 hover:underline mt-4 inline-block">
                        Go back to courses
                    </Link>
                </div>
            </div>
        );
    }

    // Determine the correct link based on whether it's a course or a live session
    const classroomLink = courseType === 'live'
        ? `/my-classroom` // Go to the main classroom page for live sessions
        : `/courses/${course.id}`; // Go directly to the course for regular courses

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-green-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white shadow-2xl rounded-2xl p-8 text-center">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
                <h1 className="text-4xl font-extrabold text-gray-900 mt-6">Enrollment Successful!</h1>
                <p className="text-gray-600 mt-3 text-lg">You have successfully enrolled in</p>
                <h2 className="text-2xl font-bold text-indigo-600 mt-2">"{course.title}"</h2>
                
                <p className="mt-6 text-gray-500">
                    You can now access your new content in your classroom. Happy learning!
                </p>

                <div className="mt-8 space-y-4">
                    <Link 
                        to={classroomLink}
                        className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition"
                    >
                        {courseType === 'live' ? 'Go to My Classroom' : 'Start Learning'}
                        <ArrowRight size={20} />
                    </Link>
                    <br />
                    <Link to="/courses" className="text-sm text-gray-500 hover:text-indigo-600 transition">
                        Or explore more courses
                    </Link>
                </div>
            </div>
        </div>
    );
}
