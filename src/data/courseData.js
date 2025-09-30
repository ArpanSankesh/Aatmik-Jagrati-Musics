// src/data/courseData.js

export const courses = [
  {
    id: 1,
    title: "Mastering the Piano: A Beginner's Guide",
    imageUrl: "/assets/Hero.jpg",
    instructor: "Sushil Kumar",
    price: "₹79",
    // The main data is now organized into levels
    levels: [
      {
        id: 'lvl1',
        title: "Level 1: The Foundations",
        chapters: [
          {
            id: 'ch1',
            title: "Chapter 1: Getting Started",
            topics: [
              { id: 't1a', title: "Introduction to the Piano", duration: "8 min", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", notes: "Welcome! In this lesson, we'll cover the basic layout of the keyboard..." },
              { id: 't1b', title: "Proper Posture & Hand Position", duration: "12 min", videoUrl: "https://www.youtube.com/embed/o-afV4a47iM", notes: "Good posture is key to avoiding injury and playing efficiently..." },
            ]
          },
          {
            id: 'ch2',
            title: "Chapter 2: Your First Notes",
            topics: [
              { id: 't2a', title: "Identifying Middle C", duration: "10 min", videoUrl: "https://www.youtube.com/embed/pI-14gKjSH0", notes: "Middle C is your anchor point on the piano. Let's find it." },
              { id: 't2b', title: "Playing C, D, and E", duration: "14 min", videoUrl: "https://www.youtube.com/embed/Y-y7_2_Yg8U", notes: "Let's play our very first notes with the right hand." },
            ]
          }
        ]
      },
      {
        id: 'lvl2',
        title: "Level 2: Basic Music Theory",
        chapters: [
          {
            id: 'ch3',
            title: "Chapter 3: The Major Scale",
            topics: [
              { id: 't3a', title: "The C Major Scale", duration: "15 min", videoUrl: "https://www.youtube.com/embed/pI-14gKjSH0", notes: "The C Major scale is fundamental. We will practice the fingerings..." },
              { id: 't3b', title: "Understanding Whole & Half Steps", duration: "18 min", videoUrl: "https://www.youtube.com/embed/Y-y7_2_Yg8U", notes: "The building blocks of all scales and melodies." },
            ]
          },
          {
            id: 'ch4',
            title: "Chapter 4: Basic Chords",
            topics: [
              { id: 't4a', title: "Your First Chords (C, G, F)", duration: "20 min", videoUrl: "https://www.youtube.com/embed/2-S-TBCI_gI", notes: "Let's learn the C Major, G Major, and F Major chords..." },
              { id: 't4b', title: "Switching Between Chords", duration: "22 min", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", notes: "Practicing smooth transitions is key to playing songs." },
            ]
          }
        ]
      },
      // ... You can add Level 3, 4, 5, etc. here following the same structure
    ]
  },
];