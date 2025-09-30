import React, { useState, useEffect } from 'react';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signInWithPopup,
    updateProfile,
    sendPasswordResetEmail // <-- NEW: Import password reset function
} from 'firebase/auth';
import { auth, googleProvider } from '../Config/firebaseConfig';
import { Link, useNavigate } from 'react-router-dom';

// Logger class for demonstration purposes
class Logger {
    constructor(context = 'App') {
        this.context = context;
    }
    info(message, data = {}) {
        console.info('ℹ️', { timestamp: new Date().toISOString(), context: this.context, message, data });
    }
    error(message, error = null, data = {}) {
        console.error('❌', { timestamp: new Date().toISOString(), context: this.context, message, data, error: error ? { name: error.name, message: error.message, code: error.code } : null });
    }
}

export default function Login() {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState(''); // <-- NEW: State for success messages

    const logger = new Logger('LoginPage');

    useEffect(() => {
        logger.info('Login page mounted', { mode: isSignUp ? 'signup' : 'signin' });
    }, [isSignUp]);

    const handleSuccess = (result) => {
        logger.info('Authentication successful', { 
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName
        });
        navigate('/courses');
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');
        logger.info('Email authentication attempt started', { name, email, isSignUp });

        try {
            let result;
            if (isSignUp) {
                result = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(result.user, {
                    displayName: name
                });
            } else {
                result = await signInWithEmailAndPassword(auth, email, password);
            }
            handleSuccess(result);
        } catch (authError) {
            handleAuthError(authError);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        setMessage('');
        logger.info('Google authentication attempt started');
        
        try {
            const result = await signInWithPopup(auth, googleProvider);
            handleSuccess(result);
        } catch (authError) {
            handleAuthError(authError);
        } finally {
            setLoading(false);
        }
    };
    
    // <-- NEW: Function to handle password reset
    const handleForgotPassword = async () => {
        if (!email) {
            setError("Please enter your email address to reset your password.");
            return;
        }

        setLoading(true);
        setError('');
        setMessage('');
        logger.info('Password reset attempt started', { email });

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage("Password reset email sent! Please check your inbox.");
        } catch (authError) {
            handleAuthError(authError);
        } finally {
            setLoading(false);
        }
    };

    const handleAuthError = (authError) => {
        logger.error('Authentication failed', authError, { email, isSignUp });
        const friendlyMessages = {
            'auth/user-not-found': 'No account found with this email.',
            'auth/wrong-password': 'Incorrect password.',
            'auth/email-already-in-use': 'An account with this email already exists.',
            'auth/weak-password': 'Password should be at least 6 characters.',
            'auth/invalid-email': 'Please enter a valid email address.',
            'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
            'auth/popup-closed-by-user': 'The sign-in window was closed. Please try again.',
            'auth/account-exists-with-different-credential': 'An account with this email already exists. Try signing in with the original method.'
        };
        setError(friendlyMessages[authError.code] || 'An unexpected error occurred. Please try again.');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        {isSignUp ? 'Create your account' : 'Sign in to your account'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {isSignUp ? 'Join us to access your music courses!' : 'Welcome back! Please sign in.'}
                    </p>
                </div>
                
                {error && (
                    <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded">
                        {error}
                    </div>
                )}
                {/* NEW: Display success message */}
                {message && (
                    <div className="p-3 text-sm text-green-700 bg-green-100 border border-green-300 rounded">
                        {message}
                    </div>
                )}
                
                <form className="space-y-6" onSubmit={handleEmailSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        {isSignUp && (
                            <div>
                                <label htmlFor="full-name" className="sr-only">Full Name</label>
                                <input
                                    id="full-name" name="name" type="text" value={name}
                                    onChange={(e) => setName(e.target.value)} autoComplete="name" required
                                    className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Full Name"
                                />
                            </div>
                        )}
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address" name="email" type="email" value={email}
                                onChange={(e) => setEmail(e.target.value)} autoComplete="email" required
                                className={`relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${isSignUp ? '' : 'rounded-t-md'}`}
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password" name="password" type="password" value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete={isSignUp ? "new-password" : "current-password"} required
                                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                            {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
                        </button>
                        {!isSignUp && (
                            // <-- MODIFIED: Changed Link to a button
                            <button type="button" onClick={handleForgotPassword} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                Forgot password?
                            </button>
                        )}
                    </div>
                    
                    <div>
                        <button type="submit" disabled={loading} className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                            {loading ? 'Processing...' : (isSignUp ? 'Sign up' : 'Sign in')}
                        </button>
                    </div>
                </form>

                <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-sm text-gray-500">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <div>
                    <button onClick={handleGoogleSignIn} disabled={loading} className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm group hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                        <img className="w-5 h-5 mr-2" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo" />
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    );
}