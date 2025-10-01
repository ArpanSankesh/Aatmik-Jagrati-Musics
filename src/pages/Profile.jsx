import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User, Mail, Edit3, Key, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Profile() {
    const { currentUser } = useAuth();
    const [displayName, setDisplayName] = useState(currentUser.displayName || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [checkingRole, setCheckingRole] = useState(true);

    // Check if user has admin role
    useEffect(() => {
        const checkAdminRole = async () => {
            try {
                // Get the ID token result which contains custom claims
                const idTokenResult = await currentUser.getIdTokenResult();
                
                // Check if user has admin custom claim
                if (idTokenResult.claims.admin === true) {
                    setIsAdmin(true);
                }
            } catch (err) {
                console.error('Error checking admin role:', err);
            } finally {
                setCheckingRole(false);
            }
        };

        if (currentUser) {
            checkAdminRole();
        }
    }, [currentUser]);

    const handleProfileUpdate = async () => {
        if (currentUser.displayName === displayName) return;

        setLoading(true);
        setError('');
        setMessage('');
        try {
            await updateProfile(currentUser, { displayName });
            setMessage('Profile updated successfully!');
        } catch (err) {
            setError('Failed to update profile. Please try again.');
            console.error(err);
        }
        setLoading(false);
    };

    const handlePasswordReset = async () => {
        setError('');
        setMessage('');
        try {
            await sendPasswordResetEmail(currentUser.auth, currentUser.email);
            setMessage(`Password reset email sent to ${currentUser.email}.`);
        } catch (err) {
            setError('Failed to send password reset email.');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-16">
            <div className="max-w-3xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

                {message && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                        {error}
                    </div>
                )}

                {/* Admin Dashboard Button */}
                {!checkingRole && isAdmin && (
                    <div className="mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Admin Access</h3>
                                    <p className="text-sm text-gray-600">You have administrator privileges</p>
                                </div>
                            </div>
                            <Link
                                to="/admin"
                                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-md flex items-center space-x-2"
                            >
                                <Shield className="w-5 h-5" />
                                <span>Go to Admin Panel</span>
                            </Link>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <User className="w-5 h-5 text-gray-400 mr-3" />
                            <div>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="text-gray-900">{currentUser.displayName || 'Not set'}</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Mail className="w-5 h-5 text-gray-400 mr-3" />
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="text-gray-900">{currentUser.email}</p>
                            </div>
                        </div>
                        {isAdmin && (
                            <div className="flex items-center">
                                <Shield className="w-5 h-5 text-indigo-600 mr-3" />
                                <div>
                                    <p className="text-sm text-gray-500">Role</p>
                                    <p className="text-indigo-600 font-medium">Administrator</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Edit3 className="w-5 h-5 mr-2" /> Update Name
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                                Display Name
                            </label>
                            <input
                                id="displayName"
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Enter your name"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleProfileUpdate}
                            disabled={loading}
                            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Updating...' : 'Save Changes'}
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Key className="w-5 h-5 mr-2" /> Password
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Reset your password via email
                    </p>
                    <button
                        type="button"
                        onClick={handlePasswordReset}
                        className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Send Reset Email
                    </button>
                </div>
            </div>
        </div>
    );
}
