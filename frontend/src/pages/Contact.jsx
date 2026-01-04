import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setSubmitting(true);
      // In a real application, you would send this to your backend API
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Thank you for your message! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-medical-light via-white to-medical-light py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Contact Us</h1>
            <p className="text-xl text-gray-600">
              We're here to help. Get in touch with us for any questions or concerns.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Get in Touch</h2>
                <p className="text-gray-600 mb-8">
                  Our team is ready to assist you with any questions about our services,
                  appointments, or general inquiries.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-medical-blue rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiMapPin className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Address</h3>
                    <p className="text-gray-600">
                      123 Medical Street<br />
                      Health City, HC 12345<br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-medical-blue rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiPhone className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Phone</h3>
                    <p className="text-gray-600">
                      <a href="tel:+15551234567" className="hover:text-medical-blue">
                        +1 (555) 123-4567
                      </a>
                      <br />
                      <a href="tel:+15551234568" className="hover:text-medical-blue">
                        +1 (555) 123-4568 (Emergency)
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-medical-blue rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiMail className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                    <p className="text-gray-600">
                      <a href="mailto:info@medicareclinic.com" className="hover:text-medical-blue">
                        info@medicareclinic.com
                      </a>
                      <br />
                      <a href="mailto:emergency@medicareclinic.com" className="hover:text-medical-blue">
                        emergency@medicareclinic.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-medical-blue rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiClock className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Working Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 9:00 AM - 2:00 PM<br />
                      Sunday: Closed<br />
                      <span className="text-red-600 font-semibold">Emergency: 24/7</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.form
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                    placeholder="Subject of your message"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                    placeholder="Your message..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-8 py-4 bg-medical-blue text-white rounded-lg hover:bg-medical-teal transition-colors font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <FiSend className="mr-2" />
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Find Us</h2>
          <div className="bg-gray-200 rounded-2xl h-96 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <FiMapPin className="w-16 h-16 mx-auto mb-4" />
              <p className="text-lg">Google Maps Integration</p>
              <p className="text-sm mt-2">123 Medical Street, Health City, HC 12345</p>
              <p className="text-sm text-gray-400 mt-4">
                (Replace with actual Google Maps embed in production)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Banner */}
      <section className="py-12 bg-red-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl font-bold mb-2">Medical Emergency?</h3>
          <p className="text-lg mb-4">Call us immediately for 24/7 emergency services</p>
          <a
            href="tel:+15551234568"
            className="text-3xl font-bold hover:underline"
          >
            +1 (555) 123-4568
          </a>
        </div>
      </section>
    </div>
  );
};

export default Contact;

