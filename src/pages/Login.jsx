// src/pages/Login.jsx

import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../Config/firebaseConfig';
import { Link } from 'react-router-dom';

// A simple logger for demonstration.
// In a real application, you might use a more robust library or a backend logging service.
class Logger {
    constructor(context = 'App') {
        this.context = context;
        this.logLevel = 'info'; // Change to 'debug' for more verbose logging
    }

    formatMessage(level, message, data = {}) {
        return {
            timestamp: new Date().toISOString(),
            level: level.toUpperCase(),
            context: this.context,
            message,
            data,
        };
    }

    info(message, data = {}) {
        const logEntry = this.formatMessage('info', message, data);
        console.info('ℹ️', logEntry);
    }

    error(message, error = null, data = {}) {
        const logEntry = this.formatMessage('error', message, {
            ...data,
            error: error ? {
                name: error.name,
                message: error.message,
                code: error.code
            } : null
        });
        console.error('❌', logEntry);
    }
}


export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const logger = new Logger('LoginPage');

    useEffect(() => {
        logger.info('Login page mounted', { 
            mode: isSignUp ? 'signup' : 'signin' 
        });
    }, [isSignUp]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        logger.info('Authentication attempt started', { 
            email, 
            isSignUp 
        });

        try {
            let result;
            if (isSignUp) {
                result = await createUserWithEmailAndPassword(auth, email, password);
                logger.info('User account created successfully', { 
                    uid: result.user.uid,
                    email: result.user.email 
                });
            } else {
                result = await signInWithEmailAndPassword(auth, email, password);
                logger.info('User signed in successfully', { 
                    uid: result.user.uid,
                    email: result.user.email
                });
            }

            // You would typically redirect the user here upon successful login/signup
            // e.g., navigate('/dashboard');

        } catch (authError) {
            logger.error('Authentication failed', authError, {
                email,
                isSignUp,
                errorCode: authError.code
            });
            
            const friendlyMessages = {
                'auth/user-not-found': 'No account found with this email.',
                'auth/wrong-password': 'Incorrect password.',
                'auth/email-already-in-use': 'An account with this email already exists.',
                'auth/weak-password': 'Password should be at least 6 characters.',
                'auth/invalid-email': 'Please enter a valid email address.',
                'auth/too-many-requests': 'Too many failed attempts. Please try again later.'
            };
            
            setError(friendlyMessages[authError.code] || 'An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        {isSignUp ? 'Create your account' : 'Sign in to your account'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {isSignUp 
                          ? 'Join us to access your music courses!' 
                          : 'Welcome back! Please sign in to access your courses.'}
                    </p>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded">
                            {error}
                        </div>
                    )}
                    
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                required
                                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete={isSignUp ? "new-password" : "current-password"}
                                required
                                className="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
                        </button>
                        
                        {!isSignUp && (
                            <Link to="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                Forgot password?
                            </Link>
                        )}
                    </div>
                    
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 animate-spin" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25"></circle>
                                        <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                isSignUp ? 'Sign up' : 'Sign in'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}