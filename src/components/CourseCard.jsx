import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function CourseCard({ course }) {
  const { currentUser } = useAuth();

  return (
    <div className="bg-white rounded-xl overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 border border-gray-200">
      {/* Image Section - Clean, no overlays */}
      <div className="relative overflow-hidden">
        <img 
          src={course.imageUrl} 
          alt={course.title} 
          className="w-full h-52 object-cover transform hover:scale-105 transition-transform duration-300" 
        />
      </div>

      {/* Content Section */}
      <div className="p-5 flex-grow flex flex-col">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-snug">
          {course.title}
        </h3>

        {/* Instructor */}
        <p className="text-sm text-gray-600 mb-3">
          {course.instructor}
        </p>

        {/* Description */}
        <p className="text-sm text-gray-500 mb-4 flex-grow line-clamp-3">
          {course.description || 'Enhance your skills with this comprehensive course.'}
        </p>

        {/* Validity Badge - Moved below description */}
        {course.validityDays && (
          <div className="inline-flex items-center gap-1.5 w-fit mb-4">
            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-indigo-600">
              {course.validityDays} days access
            </span>
          </div>
        )}

        {/* Pricing Section */}
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
          <span className="text-2xl font-bold text-gray-900">
            {course.price}
          </span>
          {course.originalPrice && (
            <span className="text-base text-gray-400 line-through">
              {course.originalPrice}
            </span>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="p-5 pt-0">
        <Link 
          to={`/course/${course.id}`} 
          className="w-full text-center block bg-indigo-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          View Course
        </Link>
      </div>
    </div>
  );
}

export default CourseCard;
