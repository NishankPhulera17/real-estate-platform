'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Wind, Mountain, Coffee, Users } from 'lucide-react';

export default function TheShift() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <section className="w-full flex flex-col justify-center px-4 md:px-8 pt-[40px] pb-[120px] overflow-hidden" style={{ backgroundColor: '#FDFBF8' }}>
      <motion.div
        className="w-full"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-100px" }}
      >
        <div>
          <h2
            className="font-sans uppercase text-center md:text-left flex flex-col"
            style={{
              color: '#0F5A36',
              fontWeight: 900,
              letterSpacing: '-0.05em',
              lineHeight: 0.85,
              fontSize: 'clamp(40px, 8.5vw, 260px)',
              fontStretch: 'condensed',
              fontFamily: '"Impact", "Arial Narrow", "Anton", sans-serif',
            }}
          >
            <motion.span variants={itemVariants} className="block whitespace-normal md:whitespace-nowrap">Migrate from noise to nature.</motion.span>
            <motion.span variants={itemVariants} className="block whitespace-normal md:whitespace-nowrap">Choose a better life.</motion.span>
          </h2>
        </div>

        {/* Bottom row: Four minimalist features */}
        <motion.div
          variants={itemVariants}
          className="max-w-[1000px] mx-auto mt-[40px]"
        >
          <div 
            className="grid grid-cols-1 md:grid-cols-4 md:divide-x border-[#E7E3DD]"
          >
          {[
            { title: 'Clean Air', desc: 'Breathe deeper.', icon: Wind },
            { title: 'Scenic Living', desc: 'Wake up to mountain views.', icon: Mountain },
            { title: 'Better Lifestyle', desc: 'Live slower, live better.', icon: Coffee },
            { title: 'Stronger Communities', desc: 'Belong to something meaningful.', icon: Users },
          ].map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center text-center px-4 md:px-6 py-6 border-[#E7E3DD]">
              <feature.icon className="w-7 h-7 mb-4 stroke-[2.5]" style={{ color: '#C96A2C' }} />
              <h3 className="font-display text-base font-medium mb-2" style={{ color: '#0F5A36' }}>{feature.title}</h3>
              <p className="text-sm font-light" style={{ color: '#5E6470' }}>{feature.desc}</p>
            </div>
          ))}
          </div>
        </motion.div>

        {/* Editorial Copy */}
        <motion.div
          variants={itemVariants}
          className="w-full max-w-[1400px] mx-auto mt-[20px] pb-[120px] px-4 md:px-8 text-left font-sans"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-[100px]">
            {/* Column 1 */}
            <div className="space-y-8" style={{ fontSize: '18px', lineHeight: 1.7, color: '#5E6470' }}>
              <div>
                <p>People spent decades moving to cities.</p>
                <p>Now many are asking a different question.</p>
              </div>
              <p className="italic font-semibold text-[22px]" style={{ color: '#C96A2C', lineHeight: 1.4 }}>
                "What if success didn't have to mean traffic, pollution, and concrete?"
              </p>
            </div>

            {/* Column 2 */}
            <div className="space-y-8" style={{ fontSize: '18px', lineHeight: 1.7, color: '#5E6470' }}>
              <p>
                NorthNest exists for people searching for something more meaningful than another apartment in another crowded city.
              </p>
              <p>
                We help individuals and families discover carefully selected land and homes across the Kumaon and Garhwal Himalayas—places where mornings begin with mountain air, where weekends belong to nature, and where life moves slower, healthier and with intention.
              </p>
            </div>

            {/* Column 3 */}
            <div className="space-y-8" style={{ fontSize: '18px', lineHeight: 1.7, color: '#5E6470' }}>
              <div>
                <p className="font-medium" style={{ color: '#0F5A36' }}>Owning land here isn't simply buying property.</p>
                <p>It's choosing clean air over pollution.</p>
                <p>Silence over noise.</p>
                <p>Mountains over concrete.</p>
                <p>Time over traffic.</p>
              </div>
              <div className="font-medium" style={{ color: '#0F5A36' }}>
                <p>Because the greatest luxury isn't a bigger city.</p>
                <p>It's a better everyday life.</p>
              </div>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}
