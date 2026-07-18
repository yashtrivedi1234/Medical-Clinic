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
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setSubmitting(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Thank you for your message! We will get back to you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const infoItems = [
    {
      icon: FiMapPin,
      title: 'Address',
      body: (
        <>
          123 Medical Street
          <br />
          Health City, HC 12345
          <br />
          United States
        </>
      ),
    },
    {
      icon: FiPhone,
      title: 'Phone',
      body: (
        <>
          <a href="tel:+15551234567" className="hover:text-medical-blue transition-colors">
            +1 (555) 123-4567
          </a>
          <br />
          <a href="tel:+15551234568" className="hover:text-medical-blue transition-colors">
            +1 (555) 123-4568 (Emergency)
          </a>
        </>
      ),
    },
    {
      icon: FiMail,
      title: 'Email',
      body: (
        <>
          <a href="mailto:info@medicareclinic.com" className="hover:text-medical-blue transition-colors">
            info@medicareclinic.com
          </a>
          <br />
          <a href="mailto:emergency@medicareclinic.com" className="hover:text-medical-blue transition-colors">
            emergency@medicareclinic.com
          </a>
        </>
      ),
    },
    {
      icon: FiClock,
      title: 'Hours',
      body: (
        <>
          Mon–Fri: 9:00 AM – 6:00 PM
          <br />
          Saturday: 9:00 AM – 2:00 PM
          <br />
          Sunday: Closed
          <br />
          <span className="text-red-600 font-semibold">Emergency: 24/7</span>
        </>
      ),
    },
  ];

  return (
    <div className="pt-20 min-h-screen bg-medical-light">
      <section className="page-header">
        <div className="container-page max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-medical-ink mb-4">Contact us</h1>
            <p className="text-xl text-medical-soft">
              Questions about services or appointments? We are here to help.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container-page">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="font-heading text-3xl font-bold text-medical-ink mb-3">Get in touch</h2>
                <p className="text-medical-soft">
                  Reach out about appointments, services, or general inquiries — we respond within one business day.
                </p>
              </div>

              <div className="space-y-6">
                {infoItems.map(({ icon: Icon, title, body }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-medical-blue rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="text-white w-5 h-5" aria-hidden />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-medical-ink mb-1">{title}</h3>
                      <div className="text-medical-soft text-sm leading-relaxed">{body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-soft border border-medical-border/60 p-6 sm:p-8"
            >
              <h2 className="font-heading text-2xl font-bold text-medical-ink mb-6">Send a message</h2>

              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="label-field">
                    Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    className="input-field"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="label-field">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className="input-field"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="label-field">
                    Phone
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    autoComplete="tel"
                    className="input-field"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="label-field">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="What is this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="label-field">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="input-field min-h-[120px]"
                    placeholder="How can we help?"
                  />
                </div>

                <button type="submit" disabled={submitting} className="btn-primary w-full">
                  <FiSend aria-hidden />
                  {submitting ? 'Sending…' : 'Send message'}
                </button>
              </div>
            </motion.form>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-page">
          <h2 className="font-heading text-2xl font-bold text-medical-ink mb-6">Find us</h2>
          <div className="rounded-2xl h-72 md:h-96 overflow-hidden border border-medical-border bg-medical-muted flex items-center justify-center">
            <div className="text-center text-medical-soft px-4">
              <FiMapPin className="w-12 h-12 mx-auto mb-3 text-medical-blue" aria-hidden />
              <p className="font-heading font-semibold text-medical-ink">123 Medical Street</p>
              <p className="text-sm mt-1">Health City, HC 12345</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-red-700 text-white">
        <div className="container-page text-center">
          <h2 className="font-heading text-2xl font-bold mb-2">Medical emergency?</h2>
          <p className="text-red-100 mb-4">Call immediately for 24/7 emergency services</p>
          <a
            href="tel:+15551234568"
            className="font-heading text-3xl font-bold hover:underline inline-flex min-h-[44px] items-center"
          >
            +1 (555) 123-4568
          </a>
        </div>
      </section>
    </div>
  );
};

export default Contact;
