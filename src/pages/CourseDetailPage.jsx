import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courses } from '../data/courseData';
import { ChevronUpIcon, PlayCircleIcon, Bars3Icon } from '@heroicons/react/24/solid';

// Helper function to find the very first topic in the course
const getFirstTopic = (course) => {
  return course?.levels?.[0]?.chapters?.[0]?.topics?.[0] || null;
};

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const course = courses.find(c => c.id === parseInt(courseId));

  const [currentTopic, setCurrentTopic] = useState(() => getFirstTopic(course));
  const [activeTab, setActiveTab] = useState('video');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State to manage which levels are open in the accordion
  const [openLevels, setOpenLevels] = useState(() => {
    const initialOpenState = {};
    if (course && course.levels) {
      initialOpenState[course.levels[0].id] = true; // Open the first level by default
    }
    return initialOpenState;
  });

  const toggleLevel = (levelId) => {
    setOpenLevels(prev => ({ ...prev, [levelId]: !prev[levelId] }));
  };
  
  const handleSelectTopic = (topic) => {
    setCurrentTopic(topic);
    setIsSidebarOpen(false); // Close mobile sidebar on selection
  };

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h2 className="text-3xl font-bold text-gray-800">Course Not Found</h2>
        <Link to="/courses" className="mt-6 px-5 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition">
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 font-sans ">
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          aria-hidden="true"
        ></div>
      )}

      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-80 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-96 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-bold text-xl text-slate-800">Course Content</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {course.levels.map((level) => (
            <div key={level.id} className="border-b border-slate-200">
              <button
                onClick={() => toggleLevel(level.id)}
                className="w-full flex justify-between items-center p-4 text-left bg-slate-50 hover:bg-slate-100 focus:outline-none"
              >
                <span className="font-bold text-slate-800">{level.title}</span>
                <ChevronUpIcon className={`w-5 h-5 text-slate-500 transition-transform ${openLevels[level.id] ? '' : 'transform rotate-180'}`} />
              </button>
              {openLevels[level.id] && (
                <div>
                  {level.chapters.map(chapter => (
                    <div key={chapter.id} className="pt-2 pb-2 pl-4 border-t border-slate-200">
                      <h4 className="font-semibold text-gray-700 px-4 py-2">{chapter.title}</h4>
                      <ul>
                        {chapter.topics.map(topic => (
                          <li key={topic.id}>
                            <button
                              onClick={() => handleSelectTopic(topic)}
                              className={`w-full text-left p-4 pl-8 text-sm flex items-start gap-3 transition-colors ${
                                currentTopic.id === topic.id
                                  ? 'bg-indigo-50 text-indigo-700'
                                  : 'text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <PlayCircleIcon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${currentTopic.id === topic.id ? 'text-indigo-500' : 'text-slate-400'}`} />
                              <div>
                                <p className={`font-medium ${currentTopic.id === topic.id ? 'text-indigo-700' : 'text-slate-800'}`}>{topic.title}</p>
                                <span className={`text-xs ${currentTopic.id === topic.id ? 'text-indigo-500' : 'text-slate-500'}`}>{topic.duration}</span>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/courses" className="text-sm text-indigo-600 hover:underline mb-2 inline-block">&larr; Back to Courses</Link>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-800">{course.title}</h1>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-indigo-600"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {currentTopic ? (
            <>
              <div className="relative">
                <div className="aspect-w-4 aspect-h-3 mb-6 rounded-lg overflow-hidden shadow-xl bg-black">
                  <iframe
                    src={currentTopic.videoUrl}
                    title={currentTopic.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
                <div 
                  className="absolute inset-0 z-10 pointer-events-none"
                  aria-hidden="true"
                ></div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">{currentTopic.title}</h2>
                <div className="border-b border-slate-200">
                  <nav className="-mb-px flex space-x-6">
                    <button 
                      onClick={() => setActiveTab('video')} 
                      className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'video' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                    >
                      Overview
                    </button>
                    <button 
                      onClick={() => setActiveTab('notes')}
                      className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'notes' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                    >
                      Notes
                    </button>
                  </nav>
                </div>
                <div className="pt-6">
                  {activeTab === 'notes' && (
                    <div className="prose max-w-none text-slate-600">
                      <p>{currentTopic.notes}</p>
                    </div>
                  )}
                  {activeTab === 'video' && (
                    <div className="text-slate-600">
                      <p>The lesson video is playing above. Use this space for downloadable resources or additional context in a real application.</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center p-10 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-700">No topics available in this course yet.</h2>
              <p className="text-gray-500 mt-2">Please check back later!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}