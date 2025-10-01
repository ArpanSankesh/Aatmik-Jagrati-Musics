import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// NEW: Import Firestore functions to fetch data
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Config/firebaseConfig';

function CourseCard({ course }) {
    const { currentUser } = useAuth();
    
    // The CourseCard component itself doesn't need changes, 
    // it will receive the 'course' prop from the parent.
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
            <div className="block">
                <img src={course.imageUrl} alt={course.title} className="w-full h-48 object-cover" />
            </div>
            <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow">{course.description}</p>
                <div className="flex justify-between items-center mt-4">
                    <p className="text-lg font-extrabold text-indigo-600">{course.price}</p>
                    <p className="text-sm text-gray-500">By {course.instructor}</p>
                </div>
            </div>
            <div className="p-4 bg-gray-50 border-t">
                {currentUser ? (
                    <Link to={`/checkout/${course.id}`} className="w-full text-center block bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition">
                        Buy Now
                    </Link>
                ) : (
                    <Link to="/login" className="w-full text-center block bg-gray-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-700 transition">
                        Sign in to Buy
                    </Link>
                )}
            </div>
        </div>
    );
}

export default function Courses() {
    // NEW: State to hold courses from Firebase and loading status
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // NEW: useEffect to fetch courses from Firestore on component mount
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const coursesCollection = collection(db, 'courses');
                const courseSnapshot = await getDocs(coursesCollection);
                const courseList = courseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setCourses(courseList);
            } catch (error) {
                console.error("Error fetching courses: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []); // Empty dependency array means this runs once on mount

    if (loading) {
        return <div className="pt-32 text-center">Loading courses...</div>;
    }

    return (
        <div className="pt-32 pb-16 px-6 md:px-16 lg:px-24 xl:px-32 bg-gray-50 min-h-screen">
            <header className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
                    Explore Our Courses
                </h1>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    Choose from our expertly crafted courses to begin your learning journey.
                </p>
            </header>
            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {courses.map(course => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </main>
        </div>
    );
}