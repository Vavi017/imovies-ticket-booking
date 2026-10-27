import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Film,
  Search,
  User,
  Ticket,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Film className="w-6 h-6 text-black font-bold stroke-[2.5]" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white flex items-center">
                I<span className="text-amber-400">MOVIES</span>
              </span>
              <span className="text-[10px] block -mt-1 font-semibold tracking-widest text-slate-400 uppercase">
                Cinema Booking
              </span>
            </div>
          </Link>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center flex-1 max-w-md mx-6"
          >
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search movies, genres, actors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-700/70 rounded-full text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>
          </form>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1 font-medium text-sm">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/') ? 'text-amber-400 bg-amber-400/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/movies"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/movies') ? 'text-amber-400 bg-amber-400/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Movies
            </Link>

            {isAuthenticated && (
              <Link
                to="/profile"
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive('/profile') ? 'text-amber-400 bg-amber-400/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Ticket className="w-4 h-4" />
                <span>My Tickets</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  isActive('/admin') ? 'text-amber-400 bg-amber-400/10' : 'text-amber-400/90 hover:text-amber-300 hover:bg-amber-400/10'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Panel</span>
              </Link>
            )}
          </nav>

          {/* User Auth Buttons or Menu */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-slate-900 border border-slate-700/80 hover:border-slate-600 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-black font-bold text-xs flex items-center justify-center">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-semibold text-white leading-tight max-w-[120px] truncate">
                      {user?.name}
                    </p>
                    <span className="text-[10px] text-amber-400 uppercase tracking-wider font-bold">
                      {user?.role}
                    </span>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/70"
                    >
                      <Ticket className="w-4 h-4 text-amber-400" />
                      <span>My Bookings</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/70"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <div className="border-t border-slate-800 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-200 hover:text-white transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-black rounded-lg shadow-md shadow-amber-500/20 transition-all hover:scale-105"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0b0f19] px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full mb-3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </form>

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800"
          >
            Home
          </Link>
          <Link
            to="/movies"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800"
          >
            Movies
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800"
              >
                My Bookings & Profile
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-amber-400 font-semibold hover:bg-slate-800"
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10"
              >
                Sign Out ({user?.name})
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-semibold text-slate-200 border border-slate-700 rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm font-semibold bg-amber-500 text-black rounded-lg"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
