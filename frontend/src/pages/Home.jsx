import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowRight,
  FiUsers,
  FiAward,
  FiHeart,
  FiCheckCircle,
  FiActivity,
  FiClipboard,
  FiShield,
} from 'react-icons/fi';
import api from '../utils/api';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&w=2000&q=80';

const serviceIconMap = {
  'General Medicine': FiActivity,
  Pediatrics: FiHeart,
  Orthopedics: FiShield,
  Gynecology: FiHeart,
  Cardiology: FiHeart,
  Diagnostics: FiClipboard,
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: 0.35, ease: 'easeOut' },
};

const Home = () => {
  const [stats, setStats] = useState({ doctors: 0, experience: 25, patients: 10000 });
  const [services, setServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsRes, servicesRes, testimonialsRes] = await Promise.all([
          api.get('/doctors'),
          api.get('/services'),
          api.get('/testimonials'),
        ]);
        setStats({
          doctors: doctorsRes.data.results || doctorsRes.data.data?.doctors?.length || 0,
          experience: 25,
          patients: 10000,
        });
        setServices(servicesRes.data.data?.services?.slice(0, 6) || []);
        setTestimonials(testimonialsRes.data.data?.testimonials?.slice(0, 3) || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Full-bleed hero — brand + headline + line + CTAs only */}
      <section className="relative min-h-[100dvh] flex items-end sm:items-center pt-20">
        <img
          src={HERO_IMAGE}
          alt=""
          width={2000}
          height={1333}
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-medical-deep/90 via-medical-deep/70 to-medical-deep/40"
          aria-hidden
        />
        <div className="relative container-page py-16 md:py-24 w-full">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            <p className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
              MediCare
            </p>
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold text-white/95 mb-4 leading-snug">
              Care that feels personal. Medicine that earns trust.
            </h1>
            <p className="text-lg text-teal-50/90 mb-8 max-w-xl">
              Book with board-certified doctors in a clinic built for calm, clarity, and outcomes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/appointments" className="btn-primary text-base">
                Book Appointment <FiArrowRight aria-hidden />
              </Link>
              <Link
                to="/doctors"
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-6 py-3 rounded-lg font-heading font-semibold border-2 border-white/80 text-white hover:bg-white hover:text-medical-ink transition-colors duration-200"
              >
                Meet Our Doctors
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="section bg-white">
        <div className="container-page">
          <motion.div {...fadeUp} className="max-w-2xl mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-medical-ink mb-3">
              Care for every stage of life
            </h2>
            <p className="text-lg text-medical-soft">
              Comprehensive services under one roof — from routine checkups to specialized care.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = serviceIconMap[service.name] || FiActivity;
              return (
                <motion.div
                  key={service._id}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: index * 0.05 }}
                  className="group border-b border-medical-border pb-6"
                >
                  <div className="w-12 h-12 rounded-lg bg-medical-light text-medical-blue flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" aria-hidden />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-medical-ink mb-2">
                    {service.name}
                  </h3>
                  <p className="text-medical-soft mb-4 leading-relaxed">{service.description}</p>
                  <Link
                    to="/services"
                    className="inline-flex items-center text-medical-blue font-medium hover:text-medical-teal transition-colors"
                  >
                    Learn more <FiArrowRight className="ml-2" aria-hidden />
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-12">
            <Link to="/services" className="btn-secondary">
              View all services <FiArrowRight aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="section bg-medical-light">
        <div className="container-page">
          <motion.div {...fadeUp} className="max-w-2xl mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-medical-ink mb-3">
              Why families choose MediCare
            </h2>
            <p className="text-lg text-medical-soft">Clear answers, experienced clinicians, and care that stays with you.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Expert doctors', desc: 'Board-certified specialists with years of focused practice' },
              { title: 'Modern facilities', desc: 'Diagnostics and equipment built for accurate, timely care' },
              { title: '24/7 emergency', desc: 'Round-the-clock response when minutes matter' },
              { title: 'Patient-first care', desc: 'Compassionate, personalized treatment plans' },
            ].map((feature, index) => (
              <motion.div key={feature.title} {...fadeUp} transition={{ ...fadeUp.transition, delay: index * 0.05 }}>
                <FiCheckCircle className="w-7 h-7 text-medical-green mb-3" aria-hidden />
                <h3 className="font-heading text-lg font-semibold text-medical-ink mb-2">{feature.title}</h3>
                <p className="text-medical-soft text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Proof / stats — below fold */}
      <section className="section bg-white border-y border-medical-border">
        <div className="container-page">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {[
              { icon: FiUsers, label: 'Expert doctors', value: `${stats.doctors}+` },
              { icon: FiAward, label: 'Years of care', value: `${stats.experience}+` },
              { icon: FiHeart, label: 'Patients served', value: `${stats.patients.toLocaleString()}+` },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: index * 0.05 }}
                className="text-center md:text-left md:border-l md:first:border-l-0 border-medical-border md:pl-8 md:first:pl-0"
              >
                <stat.icon className="w-8 h-8 text-medical-blue mx-auto md:mx-0 mb-3" aria-hidden />
                <p className="font-heading text-4xl font-bold text-medical-ink mb-1">{stat.value}</p>
                <p className="text-medical-soft">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="section bg-medical-muted/40">
          <div className="container-page">
            <motion.div {...fadeUp} className="max-w-2xl mb-12">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-medical-ink mb-3">
                What patients say
              </h2>
              <p className="text-lg text-medical-soft">Real experiences from people we care for every day.</p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {testimonials.map((testimonial, index) => (
                <motion.blockquote
                  key={testimonial._id}
                  {...fadeUp}
                  transition={{ ...fadeUp.transition, delay: index * 0.05 }}
                  className="border-l-4 border-medical-blue pl-5"
                >
                  <div className="flex gap-1 mb-3" aria-label={`${testimonial.rating} out of 5 stars`}>
                    {[...Array(5)].map((_, i) => (
                      <FiAward
                        key={i}
                        className={`w-4 h-4 ${i < testimonial.rating ? 'text-amber-500' : 'text-slate-300'}`}
                        aria-hidden
                      />
                    ))}
                  </div>
                  <p className="text-medical-ink mb-4 leading-relaxed">&ldquo;{testimonial.comment}&rdquo;</p>
                  <footer className="font-heading font-semibold text-medical-soft">
                    — {testimonial.patientName}
                  </footer>
                </motion.blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Emergency CTA */}
      <section className="py-14 bg-red-700 text-white">
        <div className="container-page text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-2">Medical emergency?</h2>
          <p className="text-lg text-red-100 mb-5">Call now for 24/7 emergency services</p>
          <a
            href="tel:+15551234567"
            className="font-heading text-3xl md:text-4xl font-bold hover:underline inline-flex min-h-[44px] items-center"
          >
            +1 (555) 123-4567
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
