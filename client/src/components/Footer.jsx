import React from 'react';
import { Film, Heart, Shield, Sparkles, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-12 mt-20 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Film className="w-5 h-5 text-black font-bold stroke-[2.5]" />
              </div>
              <span className="text-xl font-black text-white">
                I<span className="text-amber-400">MOVIES</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your next-generation cinematic ticket booking platform. Experience seamless showtime selection, live seat mapping, and instantaneous digital tickets.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/movies" className="hover:text-amber-400 transition-colors">
                  Now Showing Movies
                </Link>
              </li>
              <li>
                <Link to="/movies?genre=Sci-Fi" className="hover:text-amber-400 transition-colors">
                  Sci-Fi & IMAX Blockbusters
                </Link>
              </li>
              <li>
                <Link to="/movies?genre=Action" className="hover:text-amber-400 transition-colors">
                  Action & Thrillers
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-amber-400 transition-colors">
                  My Booked Tickets
                </Link>
              </li>
            </ul>
          </div>

          {/* Experience */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Experience
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>IMAX with Laser & 3D</span>
              </li>
              <li className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Dolby Atmos Surround</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Instant Ticket QR Code</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Prime Theatres & Multiplexes</span>
              </li>
            </ul>
          </div>

          {/* Demo Notice */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5">
            <h4 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>College Project Demo</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Full-featured MERN stack demonstration featuring JWT Auth, real-time seat reservation, mock checkout, and full Admin control.
            </p>
            <div className="text-xs bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/60 font-mono text-amber-300">
              Admin: admin@imovies.com<br />
              Pass: admin123
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} IMovies Systems. Built for College Project Submission.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> using React, Node.js, Express & MongoDB
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
