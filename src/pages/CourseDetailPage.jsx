import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShieldExclamationIcon, ChevronUpIcon, PlayCircleIcon, Bars3Icon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Config/firebaseConfig';

const getFirstTopic = (course) => {
  return course?.levels?.[0]?.chapters?.[0]?.topics?.[0] || null;
};

export default function CourseDetailPage() {
    const { courseId } = useParams();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);
    const [currentTopic, setCurrentTopic] = useState(null);
    const [activeTab, setActiveTab] = useState('video');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [openLevels, setOpenLevels] = useState({});

    useEffect(() => {
        const fetchCourseAndCheckAccess = async () => {
            if (!currentUser) {
                navigate('/login');
                return;
            }

            try {
                const courseDocRef = doc(db, 'courses', courseId);
                const courseDocSnap = await getDoc(courseDocRef);

                if (courseDocSnap.exists()) {
                    const fetchedCourse = { id: courseDocSnap.id, ...courseDocSnap.data() };
                    setCourse(fetchedCourse);

                    const userDocRef = doc(db, 'users', currentUser.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        
                        // --- COMPLETELY NEW & ROBUST ACCESS LOGIC ---
                        const enrolledCourses = userData.enrolledCourses || [];
                        
                        // 1. Find ALL enrollments for this specific course
                        const allEnrollmentsForCourse = enrolledCourses.filter(
                            (c) => c.courseId === courseId
                        );

                        if (allEnrollmentsForCourse.length > 0) {
                            // 2. Sort them to find the one with the latest expiry date
                            allEnrollmentsForCourse.sort((a, b) => b.expiryDate.toDate() - a.expiryDate.toDate());
                            
                            // 3. The most recent enrollment is the first in the sorted array
                            const latestEnrollment = allEnrollmentsForCourse[0];

                            // 4. Check if THIS latest enrollment is still valid
                            if (latestEnrollment && latestEnrollment.expiryDate.toDate() > new Date()) {
                                setHasAccess(true);
                                const firstTopic = getFirstTopic(fetchedCourse);
                                setCurrentTopic(firstTopic);
                                if (fetchedCourse.levels && fetchedCourse.levels.length > 0) {
                                    setOpenLevels({ [fetchedCourse.levels[0].id]: true });
                                }
                            } else {
                                setHasAccess(false); // Access expired
                            }
                        } else {
                            setHasAccess(false); // Not enrolled at all
                        }
                    } else {
                        setHasAccess(false);
                    }
                } else {
                    setCourse(null);
                }
            } catch (error) {
                console.error("Error fetching course data or access:", error);
                setHasAccess(false);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseAndCheckAccess();
    }, [currentUser, courseId, navigate]);

    const toggleLevel = (levelId) => setOpenLevels(prev => ({ ...prev, [levelId]: !prev[levelId] }));
    const handleSelectTopic = (topic) => {
        setCurrentTopic(topic);
        setIsSidebarOpen(false);
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen"><div>Loading course...</div></div>;
    }

    if (!course) {
        return <div className="flex items-center justify-center h-screen"><div>Course not found.</div></div>;
    }

    if (!hasAccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
                <div className="max-w-md w-full text-center bg-white p-10 rounded-xl shadow-lg">
                    <ShieldExclamationIcon className="mx-auto h-16 w-16 text-red-500" />
                    <h1 className="mt-6 text-3xl font-extrabold text-gray-900">Access Denied</h1>
                    <p className="mt-4 text-gray-600">Your access to this course has expired or you are not enrolled.</p>
                    <div className="mt-8">
                        {/* BUTTON MODIFIED: Changed from Link to button, removed 'to' prop */}
                        <button
                            type="button"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-not-allowed opacity-90"
                        >
                            Enroll Now for {course.price}
                        </button>
                        
                        <Link
                            to="/my-courses"
                            className="mt-4 block text-sm text-gray-600 hover:text-indigo-500"
                        >
                            Go to My Courses
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-100 font-sans ">
            {isSidebarOpen && (
                <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" aria-hidden="true"></div>
            )}
            <aside className={`fixed inset-y-0 left-0 z-40 w-80 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-96 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b border-slate-200"><h2 className="font-bold text-xl text-slate-800">Course Content</h2></div>
                <div className="flex-1 overflow-y-auto">
                    {course.levels?.map((level) => (
                        <div key={level.id} className="border-b border-slate-200">
                            <button onClick={() => toggleLevel(level.id)} className="w-full flex justify-between items-center p-4 text-left bg-slate-50 hover:bg-slate-100 focus:outline-none">
                                <span className="font-bold text-slate-800">{level.title}</span>
                                <ChevronUpIcon className={`w-5 h-5 text-slate-500 transition-transform ${openLevels[level.id] ? '' : 'transform rotate-180'}`} />
                            </button>
                            {openLevels[level.id] && (
                                <div>
                                    {level.chapters?.map(chapter => (
                                        <div key={chapter.id} className="pt-2 pb-2 pl-4 border-t border-slate-200">
                                            <h4 className="font-semibold text-gray-700 px-4 py-2">{chapter.title}</h4>
                                            <ul>
                                                {chapter.topics?.map(topic => (
                                                    <li key={topic.id}>
                                                        <button onClick={() => handleSelectTopic(topic)} className={`w-full text-left p-4 pl-8 text-sm flex items-start gap-3 transition-colors ${currentTopic?.id === topic.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                                                            <PlayCircleIcon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${currentTopic?.id === topic.id ? 'text-indigo-500' : 'text-slate-400'}`} />
                                                            <div>
                                                                <p className={`font-medium ${currentTopic?.id === topic.id ? 'text-indigo-700' : 'text-slate-800'}`}>{topic.title}</p>
                                                                <span className={`text-xs ${currentTopic?.id === topic.id ? 'text-indigo-500' : 'text-slate-500'}`}>{topic.duration}</span>
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
                        <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 hover:text-indigo-600"><Bars3Icon className="w-6 h-6" /></button>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-6">
                    {currentTopic ? (
                        <>
                            <div className="w-full mb-6">
                                <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-xl" style={{ paddingBottom: '56.25%' }}>
                                    <video
                                        key={currentTopic.id}
                                        className="absolute top-0 left-0 w-full h-full"
                                        src={currentTopic.videoUrl}
                                        controls
                                        controlsList="nodownload noremoteplayback"
                                        disablePictureInPicture
                                        onContextMenu={(e) => e.preventDefault()}
                                        style={{ objectFit: 'contain' }}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-2xl font-bold text-slate-800 mb-4">{currentTopic.title}</h2>
                                <div className="border-b border-slate-200">
                                    <nav className="-mb-px flex space-x-6">
                                        <button onClick={() => setActiveTab('video')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'video' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>Overview</button>
                                        <button onClick={() => setActiveTab('notes')} className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'notes' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>Notes</button>
                                    </nav>
                                </div>
                                <div className="pt-6">
                                    {activeTab === 'video' && (
                                        <div className="text-slate-600">
                                            <p>The lesson video is playing above. Select a lesson from the sidebar to begin.</p>
                                        </div>
                                    )}
                                    {activeTab === 'notes' && (
                                        <div className="prose max-w-none text-slate-600">
                                            {currentTopic.notesImageUrl && (
                                                <img
                                                    src={currentTopic.notesImageUrl}
                                                    alt={`Notes for ${currentTopic.title}`}
                                                    className="max-w-full h-auto rounded-lg mb-4 shadow-md"
                                                />
                                            )}

                                            {currentTopic.notes ? (
                                                <p>{currentTopic.notes}</p>
                                            ) : null}

                                            {!currentTopic.notesImageUrl && !currentTopic.notes && (
                                                <p>No notes available for this lesson.</p>
                                            )}
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