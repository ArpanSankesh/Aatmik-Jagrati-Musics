import React from 'react';
import { Link } from 'react-router-dom';

export default function CourseCard({ title, description, imageUrl, instructor, price }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
      <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        <div className="flex justify-between items-center text-gray-500 text-sm mb-4">
          <p>By: <span className="text-indigo-600 font-semibold">{instructor}</span></p>
          <p className="font-bold text-xl text-indigo-600">{price}</p>
        </div>
        <Link to="/login"> {/* This link can be updated to a specific course detail page later */}
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors text-white py-2 rounded-md font-semibold">
            Enroll Now
          </button>
        </Link>
      </div>
    </div>
  );
}