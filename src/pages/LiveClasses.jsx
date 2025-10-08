import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Config/firebaseConfig';
import LiveClassCard from '../components/LiveClassCard'; // Use the new card

export default function LiveClasses() {
    const [liveCourses, setLiveCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLiveCourses = async () => {
            try {
                const coursesCollection = collection(db, 'liveCourses');
                const courseSnapshot = await getDocs(coursesCollection);
                const courseList = courseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setLiveCourses(courseList);
            } catch (error) {
                console.error("Error fetching live courses: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLiveCourses();
    }, []);

    if (loading) {
        return <div className="pt-32 text-center">Loading live classes...</div>;
    }

    return (
        <div className="pt-32 pb-16 px-6 md:px-16 lg:px-24 xl:px-32 bg-gray-50 min-h-screen">
            <header className="text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
                    Upcoming Live Classes
                </h1>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    Join our live interactive sessions and learn directly from the experts.
                </p>
            </header>
            <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {liveCourses.map(course => (
                    <LiveClassCard key={course.id} course={course} />
                ))}
            </main>
        </div>
    );
}