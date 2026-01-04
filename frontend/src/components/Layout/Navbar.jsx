import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiUser } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    { path: '/appointments', label: 'Appointments' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white shadow-lg'
          : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-medical-blue to-medical-teal rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">M</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">MediCare</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-700 hover:text-medical-blue transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/portal"
                  className="flex items-center space-x-2 text-gray-700 hover:text-medical-blue transition-colors"
                >
                  <FiUser />
                  <span>{user.name}</span>
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="px-4 py-2 bg-medical-blue text-white rounded-lg hover:bg-medical-teal transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/portal"
                className="px-6 py-2 bg-medical-blue text-white rounded-lg hover:bg-medical-teal transition-colors font-medium"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 focus:outline-none"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 space-y-4"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block text-gray-700 hover:text-medical-blue transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <div className="space-y-2 pt-4 border-t">
                <Link
                  to="/portal"
                  onClick={() => setIsOpen(false)}
                  className="block text-gray-700 hover:text-medical-blue transition-colors"
                >
                  {user.name}
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 bg-medical-blue text-white rounded-lg text-center"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/portal"
                onClick={() => setIsOpen(false)}
                className="block px-6 py-2 bg-medical-blue text-white rounded-lg text-center font-medium"
              >
                Login
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;

