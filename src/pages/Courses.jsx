import React from 'react';
import { Link } from 'react-router-dom';
import { courses } from '../data/courseData';
import { useAuth } from '../context/AuthContext'; // Import useAuth to check login status

// Updated CourseCard to include a "Buy Now" button
function CourseCard({ course }) {
    const { currentUser } = useAuth();
    
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-2 transition-transform duration-300">
            <Link to={`/courses/${course.id}`} className="block">
                <img src={course.imageUrl} alt={course.title} className="w-full h-48 object-cover" />
            </Link>
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
                    <Link to={`/course/${course.id}/checkout`} className="w-full text-center block bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition">
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