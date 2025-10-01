import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../Config/firebaseConfig';
import { BookOpen } from 'lucide-react';

export default function MyCourses() {
    const { currentUser } = useAuth();
    const [myCourses, setMyCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyCourses = async () => {
            if (currentUser) {
                try {
                    const userDocRef = doc(db, 'users', currentUser.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        let purchasedCourseIds = userData.purchasedCourses || [];
                        
                        // --- THIS IS THE FIX ---
                        // Ensure all IDs are strings before querying to prevent data-type issues.
                        purchasedCourseIds = purchasedCourseIds.map(id => String(id));

                        if (purchasedCourseIds.length > 0) {
                            const coursesRef = collection(db, 'courses');
                            const q = query(coursesRef, where('__name__', 'in', purchasedCourseIds));
                            
                            const querySnapshot = await getDocs(q);
                            const enrolledCourses = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                            setMyCourses(enrolledCourses);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching enrolled courses:", error);
                }
            }
            setLoading(false);
        };

        fetchMyCourses();
    }, [currentUser]);

    if (loading) {
        return <div className="text-center pt-40">Loading your courses...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-16 px-6 md:px-16">
            <header className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
                    My Learning
                </h1>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    Your enrolled courses. Click on any course to start learning.
                </p>
            </header>
            
            <main className="max-w-6xl mx-auto">
                {myCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {myCourses.map(course => (
                            <Link to={`/courses/${course.id}`} key={course.id}>
                                <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-2 transition-transform duration-300 h-full">
                                    <div className="block">
                                        <img src={course.imageUrl} alt={course.title} className="w-full h-48 object-cover" />
                                    </div>
                                    <div className="p-6 flex-grow flex flex-col">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                                        <div className="mt-auto pt-4">
                                            <div className="w-full text-center block bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md">
                                                Start Learning
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center bg-white p-12 rounded-lg shadow-lg">
                        <BookOpen className="mx-auto h-16 w-16 text-gray-300" />
                        <h2 className="mt-4 text-xl font-semibold text-gray-800">You haven't enrolled in any courses yet.</h2>
                        <Link to="/courses" className="mt-6 inline-block bg-indigo-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-indigo-700 transition">
                            Explore Courses
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}