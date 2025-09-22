import React from 'react';
import CourseCard from '../components/CourseCard';

export default function Courses() {
  // Data for a single piano course.
  const courses = [
    {
      id: 1,
      title: "Mastering the Piano: A Beginner's Guide",
      description: "Learn to play the piano from scratch. This course covers the basics of music theory, finger techniques, and your first melodies.",
      imageUrl: "/public/assets/Hero.jpg",
      instructor: "Sushil Kumar",
      price: "$79",
    },
  ];

  return (
    <div className="pt-25 md:pt-30 px-6 md:px-16 lg:px-24 xl:px-32">
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
          <CourseCard 
            key={course.id}
            title={course.title}
            description={course.description}
            imageUrl={course.imageUrl}
            instructor={course.instructor}
            price={course.price}
          />
        ))}
      </main>
    </div>
  );
}