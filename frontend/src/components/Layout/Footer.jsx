import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';
import { LogoMark } from './Navbar';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-medical-deep text-white mt-auto">
      <div className="container-page py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <LogoMark className="w-10 h-10" />
              <span className="font-heading text-2xl font-bold">MediCare</span>
            </div>
            <p className="text-teal-100/80 leading-relaxed mb-4">
              Compassionate care, modern facilities, and doctors you can trust — serving families for over 25 years.
            </p>
            <p className="text-sm text-teal-200/70">JCI · NABH · HIPAA compliant</p>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                ['/about', 'About Us'],
                ['/doctors', 'Our Doctors'],
                ['/services', 'Services'],
                ['/appointments', 'Book Appointment'],
                ['/contact', 'Contact Us'],
                ['/portal', 'Patient Portal'],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-teal-100/80 hover:text-white transition-colors duration-200 inline-flex min-h-[36px] items-center"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">Care Areas</h3>
            <ul className="space-y-2 text-teal-100/80">
              <li>General Medicine</li>
              <li>Pediatrics</li>
              <li>Orthopedics</li>
              <li>Gynecology</li>
              <li>Cardiology</li>
              <li>Diagnostics</li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-4 text-teal-100/80">
              <li className="flex items-start gap-3">
                <FiMapPin className="mt-1 flex-shrink-0 text-primary-300" aria-hidden />
                <span>123 Medical Street, Health City, HC 12345</span>
              </li>
              <li className="flex items-center gap-3">
                <FiPhone className="flex-shrink-0 text-primary-300" aria-hidden />
                <a href="tel:+15551234567" className="hover:text-white transition-colors">
                  +1 (555) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="flex-shrink-0 text-primary-300" aria-hidden />
                <a href="mailto:info@medicareclinic.com" className="hover:text-white transition-colors">
                  info@medicareclinic.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FiClock className="mt-1 flex-shrink-0 text-primary-300" aria-hidden />
                <span>
                  Mon–Fri 9:00 AM – 6:00 PM
                  <br />
                  Sat 9:00 AM – 2:00 PM
                  <br />
                  Sun Closed · Emergency 24/7
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-8 flex flex-col sm:flex-row gap-3 justify-between text-sm text-teal-100/60">
          <p>&copy; {currentYear} MediCare Clinic. All rights reserved.</p>
          <p>Your health, our priority.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
