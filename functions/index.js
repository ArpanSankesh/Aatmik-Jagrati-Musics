// In functions/index.js

/**
 * Import function triggers from their respective submodules:
 */
const {onCall, HttpsError} = require("firebase-functions/v2/https");
const {setGlobalOptions} = require("firebase-functions/v1");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const cloudinary = require("cloudinary").v2;

// Initialize Firebase Admin SDK
admin.initializeApp();

// Configure Cloudinary using environment variables from your .env file
// Make sure you have created a .env file in this 'functions' folder
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

setGlobalOptions({ maxInstances: 10 });

/**
 * A callable function to securely generate a signed URL for a private Cloudinary video.
 */
exports.getSignedVideoUrl = onCall(async (request) => {
  // 1. Check if the user is authenticated.
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "You must be logged in to view this content."
    );
  }

  const userId = request.auth.uid;
  const { publicId, courseId } = request.data; // Get data sent from the frontend

  if (!publicId || !courseId) {
    throw new HttpsError(
      "invalid-argument",
      "The function must be called with a 'publicId' and 'courseId'."
    );
  }

  // 2. CRITICAL SECURITY CHECK: Verify the user has purchased this course in Firestore.
  try {
    const userDoc = await admin.firestore().collection("users").doc(userId).get();
    if (!userDoc.exists) {
      throw new HttpsError("not-found", "User document not found.");
    }
    const purchasedCourses = userDoc.data().purchasedCourses || [];
    if (!purchasedCourses.includes(courseId)) {
      throw new HttpsError("permission-denied", "You do not have access to this course.");
    }
  } catch (error) {
    logger.error("Error checking course access for user:", userId, error);
    throw new HttpsError("internal", "An error occurred while checking course access.");
  }

  // 3. If access is verified, generate the signed URL from Cloudinary.
  try {
    const signedUrl = cloudinary.url(publicId, {
      resource_type: "video",
      sign_url: true,
      expires_at: Math.round(new Date().getTime() / 1000) + 3600, // URL expires in 1 hour
    });
    return { url: signedUrl };
  } catch (error) {
    logger.error("Cloudinary URL generation error:", error);
    throw new HttpsError(
      "internal",
      "Could not generate a secure video URL."
    );
  }
});