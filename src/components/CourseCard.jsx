import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function CourseCard({ course }) {
  const { currentUser } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-2 transition-transform duration-300 border border-gray-100">
      <div className="block">
        <img src={course.imageUrl} alt={course.title} className="w-full h-48 object-cover" />
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">
          {course.description || 'Enhance your skills with this comprehensive course.'}
        </p>
        <div className="flex justify-between items-end mt-4">
          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-extrabold text-indigo-600">{course.price}</p>
              {course.originalPrice && (
                <p className="text-sm text-gray-400 line-through">{course.originalPrice}</p>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-500">By {course.instructor}</p>
        </div>
      </div>
      <div className="p-4 bg-gray-50 border-t">
        <Link 
          to={`/course/${course.id}`} 
          className="w-full text-center block bg-indigo-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-indigo-700 transition shadow-sm"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default CourseCard;
