import React, { useState } from 'react';

const domains = {
  code: {
    title: 'Code',
    description:
      'One of the finest coding communities to be a part of in Manipal, IECSE’s code domain provides the best resources to help hone coding, problem solving, and logical skills. Dive deep into Competitive Programming through our various workshops and coding contests held on our very own, Code Portal.',
    icon: '{}',
  },
  dev: {
    title: 'Dev',
    description:
      'The dev domain focuses on full-stack development, building applications, and learning cutting-edge tools and frameworks through projects and mentorship.',
    icon: '📱',
  },
  ml: {
    title: 'ML',
    description:
      'Explore the world of Machine Learning and AI through practical projects, model training sessions, and research discussions.',
    icon: '🧠',
  },
  hashtag: {
    title: 'Hashtag',
    description:
      'Our content and media team handles branding, social media, copywriting, and more. Perfect for creatives who love storytelling.',
    icon: '#',
  },
  studios: {
    title: 'Studios',
    description:
      'Focuses on design, animations, and UI/UX. The most visual domain, where your creativity gets to shine in everything we build.',
    icon: '▶',
  },
};

const WhatWeDo = () => {
  const [active, setActive] = useState('code');

  return (
    <section className="bg-white py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h2 className="text-4xl font-bold text-gray-900 mb-2">What We Do</h2>
        <div className="flex items-center gap-4 mb-12">
          <div className="w-1 h-6 bg-blue-400 rounded-sm"></div>
          <p className="tracking-widest text-blue-400 text-sm">
            O U R &nbsp;&nbsp; D O M A I N S
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-16">
          {/* Left Bubble Group */}
          <div className="relative flex flex-wrap gap-6 w-full md:w-1/2 max-w-sm mx-auto md:mx-0">
            {Object.entries(domains).map(([key, domain], index) => (
              <div
                key={key}
                onClick={() => setActive(key)}
                className={`flex flex-col items-center justify-center rounded-full w-20 h-20 text-white text-sm cursor-pointer transition-all duration-300 ${
                  active === key ? 'bg-gradient-to-r from-cyan-400 to-blue-500 scale-105' : 'bg-black'
                }`}
              >
                <span className="text-xl">{domain.icon}</span>
                <p className="text-xs mt-1">{key}</p>
              </div>
            ))}

            {/* Optional Decorative Dots like in the image */}
            <div className="absolute -bottom-4 left-0 flex gap-2">
              <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
              <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
            </div>
          </div>

          {/* Right Description */}
          <div className="md:w-1/2 border-l border-gray-300 pl-6">
            <h3 className="text-3xl font-semibold text-sky-500">{domains[active].title}</h3>
            <p className="mt-4 text-gray-700 leading-relaxed text-base">
              {domains[active].description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
