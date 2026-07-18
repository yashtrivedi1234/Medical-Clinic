import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAward, FiTarget, FiHeart, FiCheckCircle, FiArrowRight } from 'react-icons/fi';

const STORY_IMAGE =
  'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80';

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.35, ease: 'easeOut' },
};

const About = () => {
  return (
    <div className="pt-20">
      <section className="page-header">
        <div className="container-page max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <p className="text-medical-blue font-heading font-semibold mb-2">About MediCare</p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-medical-ink mb-4">
              Healthcare rooted in trust
            </h1>
            <p className="text-xl text-medical-soft">
              Delivering exceptional care with compassion and clarity for over 25 years.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-page">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div {...fadeUp}>
              <h2 className="font-heading text-3xl font-bold text-medical-ink mb-6">Our story</h2>
              <p className="text-medical-soft mb-4 leading-relaxed">
                Founded in 1998, MediCare Clinic set out to make quality healthcare accessible to everyone in our community.
              </p>
              <p className="text-medical-soft mb-4 leading-relaxed">
                We have grown into a trusted institution — doctors, nurses, and support staff working as one team for better outcomes.
              </p>
              <p className="text-medical-soft leading-relaxed">
                Today we invest in modern technology, advanced equipment, and continuous training to keep care standards high.
              </p>
            </motion.div>
            <motion.div {...fadeUp} className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lift">
              <img
                src={STORY_IMAGE}
                alt="MediCare clinic care team with a patient"
                className="w-full h-full object-cover"
                loading="lazy"
                width={1200}
                height={900}
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section bg-medical-light">
        <div className="container-page">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            <motion.div {...fadeUp}>
              <FiTarget className="w-9 h-9 text-medical-blue mb-4" aria-hidden />
              <h3 className="font-heading text-2xl font-bold text-medical-ink mb-3">Mission</h3>
              <p className="text-medical-soft leading-relaxed">
                Accessible, high-quality care that improves community health through compassion, excellence, and innovation.
              </p>
            </motion.div>
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.05 }}>
              <FiAward className="w-9 h-9 text-medical-blue mb-4" aria-hidden />
              <h3 className="font-heading text-2xl font-bold text-medical-ink mb-3">Vision</h3>
              <p className="text-medical-soft leading-relaxed">
                To be the region’s most trusted clinic — known for patient outcomes, medical innovation, and community wellness.
              </p>
            </motion.div>
            <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
              <FiHeart className="w-9 h-9 text-medical-blue mb-4" aria-hidden />
              <h3 className="font-heading text-2xl font-bold text-medical-ink mb-3">Values</h3>
              <ul className="text-medical-soft space-y-2">
                {['Compassion', 'Excellence', 'Integrity', 'Innovation'].map((v) => (
                  <li key={v} className="flex items-center gap-2">
                    <FiCheckCircle className="text-medical-green flex-shrink-0" aria-hidden />
                    {v}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-page">
          <motion.div {...fadeUp} className="mb-10 max-w-2xl">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-medical-ink mb-3">
              Certifications & accreditations
            </h2>
            <p className="text-lg text-medical-soft">Recognized for excellence and compliance</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['JCI Accredited', 'ISO 9001 Certified', 'NABH Accredited', 'HIPAA Compliant'].map((cert, i) => (
              <motion.div
                key={cert}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.04 }}
                className="border border-medical-border rounded-xl p-5 text-center bg-medical-light/50"
              >
                <FiAward className="w-8 h-8 text-medical-blue mx-auto mb-3" aria-hidden />
                <p className="font-heading font-semibold text-medical-ink text-sm sm:text-base">{cert}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-medical-muted/30">
        <div className="container-page">
          <motion.div {...fadeUp} className="mb-10 max-w-2xl">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-medical-ink mb-3">
              Modern infrastructure
            </h2>
            <p className="text-lg text-medical-soft">Facilities designed for precise, timely care</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-8">
            {[
              { title: 'Advanced diagnostics', desc: 'Latest imaging and lab equipment' },
              { title: 'Surgical suites', desc: 'Modern ORs with cutting-edge technology' },
              { title: 'Emergency department', desc: '24/7 care with rapid response' },
              { title: 'ICU facilities', desc: 'Intensive care with advanced monitoring' },
              { title: 'In-house pharmacy', desc: 'Medications without an extra trip' },
              { title: 'Rehabilitation', desc: 'Physical therapy and recovery support' },
            ].map((facility, i) => (
              <motion.div key={facility.title} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.03 }}>
                <h3 className="font-heading text-lg font-semibold text-medical-ink mb-1">{facility.title}</h3>
                <p className="text-medical-soft text-sm">{facility.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-12">
            <Link to="/appointments" className="btn-primary">
              Book a visit <FiArrowRight aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
