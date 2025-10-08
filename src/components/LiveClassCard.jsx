import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';

function LiveClassCard({ course }) {
  // Format the live date
  const formatLiveDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatLiveTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 border border-gray-200">
      <div className="relative overflow-hidden">
        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 animate-pulse">
          LIVE
        </div>
        <img 
          src={course.imageUrl} 
          alt={course.title} 
          className="w-full h-52 object-cover transform hover:scale-105 transition-transform duration-300" 
        />
      </div>

      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 leading-snug">
          {course.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          By {course.instructor}
        </p>
        
        {/* Live Date & Time */}
        {course.liveDate && (
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-gray-700">
                {formatLiveDate(course.liveDate)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-gray-700">
                {formatLiveTime(course.liveDate)}
              </span>
            </div>
          </div>
        )}
        
        {course.validityDays && (
          <div className="inline-flex items-center gap-1.5 w-fit mb-4 bg-indigo-50 px-3 py-1.5 rounded-lg">
            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-indigo-600">
              {course.validityDays} days recording access
            </span>
          </div>
        )}

        <div className="flex items-center gap-3 mt-auto pt-3 border-t border-gray-100">
          <span className="text-2xl font-bold text-gray-900">
            {course.price}
          </span>
        </div>
      </div>

      <div className="p-5 pt-0">
        <Link 
          to={`/live-course/${course.id}`} 
          className="w-full text-center block bg-indigo-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default LiveClassCard;
