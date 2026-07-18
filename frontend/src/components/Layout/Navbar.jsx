import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiUser, FiCalendar } from 'react-icons/fi';

const LogoMark = ({ className = 'w-10 h-10' }) => (
  <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <rect width="40" height="40" rx="10" fill="#0891B2" />
    <path
      d="M20 10v20M12 18h16"
      stroke="white"
      strokeWidth="3.2"
      strokeLinecap="round"
    />
  </svg>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/doctors', label: 'Doctors' },
    { path: '/services', label: 'Services' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-200 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-soft' : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <div className="container-page">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-2.5 group" aria-label="MediCare home">
            <LogoMark className="w-10 h-10 transition-transform duration-200 group-hover:scale-105" />
            <span className="font-heading text-xl sm:text-2xl font-bold text-medical-ink tracking-tight">
              MediCare
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-2 min-h-[44px] inline-flex items-center font-medium transition-colors duration-200 ${
                  isActive(link.path)
                    ? 'text-medical-blue'
                    : 'text-medical-soft hover:text-medical-ink'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute bottom-1 left-3 right-3 h-0.5 bg-medical-blue rounded-full" />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/dashboard" className="btn-ghost text-sm">
                  <FiUser aria-hidden />
                  <span>{user.name?.split(' ')[0] || 'Account'}</span>
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="btn-ghost text-sm text-medical-blue">
                    Admin
                  </Link>
                )}
                <button type="button" onClick={handleLogout} className="btn-ghost text-sm border border-slate-200">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/portal" className="btn-ghost text-sm border border-slate-200">
                Login
              </Link>
            )}
            <Link to="/appointments" className="btn-primary text-sm">
              <FiCalendar aria-hidden />
              Book Appointment
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-medical-ink rounded-lg hover:bg-medical-muted"
            aria-expanded={isOpen}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-t border-medical-border"
            >
              <div className="py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`block min-h-[44px] px-3 py-3 rounded-lg font-medium ${
                      isActive(link.path)
                        ? 'bg-medical-light text-medical-blue'
                        : 'text-medical-ink hover:bg-medical-muted'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-3 space-y-2 border-t border-medical-border mt-2">
                  {user ? (
                    <>
                      <Link to="/dashboard" className="btn-ghost w-full justify-start">
                        <FiUser /> {user.name}
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" className="btn-secondary w-full">
                          Admin Panel
                        </Link>
                      )}
                      <button type="button" onClick={handleLogout} className="btn-ghost w-full border border-slate-200">
                        Logout
                      </button>
                    </>
                  ) : (
                    <Link to="/portal" className="btn-secondary w-full">
                      Login
                    </Link>
                  )}
                  <Link to="/appointments" className="btn-primary w-full">
                    <FiCalendar /> Book Appointment
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;
export { LogoMark };
