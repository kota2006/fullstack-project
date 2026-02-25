import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Award, User, Home } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="flex-shrink-0 flex items-center">
                            <Award className="h-8 w-8 text-agri-600" />
                            <span className="ml-2 text-xl font-bold text-gray-900">CertTrack</span>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link
                                to={user.role === 'admin' ? '/admin' : '/dashboard'}
                                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                            >
                                <Home className="w-4 h-4 mr-1" />
                                {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/profile"
                            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                        >
                            <User className="h-5 w-5" />
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            title="Logout"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
