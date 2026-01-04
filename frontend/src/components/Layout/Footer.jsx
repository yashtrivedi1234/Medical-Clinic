import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-medical-blue to-medical-teal rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">M</span>
              </div>
              <span className="text-2xl font-bold">MediCare</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your trusted healthcare partner providing comprehensive medical services with care, compassion, and excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-medical-blue transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="text-gray-400 hover:text-medical-blue transition-colors">
                  Our Doctors
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-medical-blue transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/appointments" className="text-gray-400 hover:text-medical-blue transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-medical-blue transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li>General Medicine</li>
              <li>Pediatrics</li>
              <li>Orthopedics</li>
              <li>Gynecology</li>
              <li>Cardiology</li>
              <li>Diagnostics</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start space-x-3">
                <FiMapPin className="mt-1 flex-shrink-0" />
                <span>123 Medical Street, Health City, HC 12345</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiPhone className="flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="flex-shrink-0" />
                <span>info@medicareclinic.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <FiClock className="mt-1 flex-shrink-0" />
                <span>
                  Mon-Fri: 9:00 AM - 6:00 PM<br />
                  Sat: 9:00 AM - 2:00 PM<br />
                  Sun: Closed
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} MediCare Clinic. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

