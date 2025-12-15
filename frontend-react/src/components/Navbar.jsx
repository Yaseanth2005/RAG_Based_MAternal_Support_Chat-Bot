import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, Moon, Sun, LogOut, User, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ theme, toggleTheme }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    return (
        <nav className="glass-nav">
            <div className="container flex items-center justify-between nav-h">
                <Link to="/" className="flex items-center gap-4">
                    <div className="brand-box">
                        <Heart size={16} fill="currentColor" strokeWidth={2.5} />
                    </div>
                    <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                        MaternalCare
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link
                                to="/chat"
                                className={`btn ${location.pathname === '/chat' ? 'btn-primary' : 'btn-secondary'} py-1.5 px-4 text-xs font-semibold`}
                            >
                                <MessageCircle size={14} className="mr-2" strokeWidth={2.5} />
                                <span>Assistant</span>
                            </Link>

                            <div className="nav-divider hidden sm:block"></div>

                            <button
                                onClick={toggleTheme}
                                className="nav-icon-btn"
                                title="Toggle Theme"
                            >
                                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} className="text-yellow-400" />}
                            </button>

                            <div className="flex items-center gap-2 pl-1">
                                <div className="user-avatar">
                                    {user.name ? user.name[0].toUpperCase() : <User size={14} />}
                                </div>
                                <button
                                    onClick={logout}
                                    className="nav-icon-btn hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                                    title="Logout"
                                >
                                    <LogOut size={16} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleTheme}
                                className="icon-btn border-none"
                            >
                                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                            </button>
                            <Link to="/login" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors">
                                Log In
                            </Link>
                            <Link to="/register" className="btn btn-primary py-2.5 px-6">
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
