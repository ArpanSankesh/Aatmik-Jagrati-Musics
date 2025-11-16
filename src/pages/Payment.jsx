import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../Config/firebaseConfig";
import useAuth from "../context/AuthContext";

export default function Payment() {
  const { courseId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courseType, setCourseType] = useState("course");

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      
      if (courseId) {
        // Try regular courses first
        let docRef = doc(db, "courses", courseId);
        let docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setCourse({ id: docSnap.id, ...docSnap.data() });
          setCourseType("course");
        } else {
          // Try live courses
          docRef = doc(db, "liveCourses", courseId);
          docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setCourse({ id: docSnap.id, ...docSnap.data() });
            setCourseType("live");
          }
        }
      }
      setLoading(false);
    };
    fetchCourse();
  }, [courseId]);

  const displayRazorpay = async () => {
    if (!course) return;

    try {
      // Call your Firebase Cloud Function
      const response = await fetch(
        "https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/api/create-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            courseId: course.id,
            courseType: courseType 
          }),
        }
      );

      const order = await response.json();

      const options = {
        key: "rzp_test_XXXXXXXXXXXX", // Replace with your actual Razorpay test key
        amount: order.amount,
        currency: order.currency,
        name: "Aatmik Jagrati Musics",
        description: `Payment for ${course.title}`,
        order_id: order.id,
        handler: async function (response) {
          // Verify payment with your Firebase Cloud Function
          const verifyResponse = await fetch(
            "https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/api/verify-payment",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId: course.id,
                userId: currentUser.uid,
                courseType: courseType,
              }),
            }
          );

          const result = await verifyResponse.json();
          
          if (result.status === "success") {
            navigate(`/purchase-success/${course.id}`);
          } else {
            alert("Payment verification failed!");
          }
        },
        prefill: {
          name: currentUser?.displayName || "User",
          email: currentUser?.email || "guest@example.com",
        },
        notes: { 
          courseId: course.id,
          courseType: courseType 
        },
        theme: { color: "#2563eb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to initiate payment. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <p>Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <p>Course not found.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Complete Payment
        </h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">{course.title}</h2>
          <p className="text-gray-600 mb-4">{course.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Amount:</span>
            <span className="text-2xl font-bold text-green-600">
              ₹{course.price.replace("₹", "")}
            </span>
          </div>
        </div>

        <button
          onClick={displayRazorpay}
          className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
        >
          Proceed to Pay ₹{course.price.replace("₹", "")}
        </button>
      </div>
    </div>
  );
}
