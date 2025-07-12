import React from 'react'

const LearnAndGrow = () => {
  return (
    <div>
              {/* Learn and Grow Section */}
<section className="py-16 px-4 sm:px-8 lg:px-16 bg-black text-white">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
    
    {/* Text Section */}
    <div>
      <h2 className="text-3xl sm:text-4xl font-bold text-teal-400 mb-4">LEARN AND GROW</h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        We are fun—be it giving our best at CTFs as a team, coming together to organise technical and 
        non-technical events on a grand scale, or going out to party. We are proud to have an interdisciplinary 
        team that consists of talented, skilled and hard-working students, united by cybersecurity.
      </p>
      <a href="/team" className="text-teal-400 hover:underline flex items-center space-x-1 group">
        <span>Meet our team</span>
        <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
      </a>
    </div>

    {/* Image Section */}
    <div>
      <img
        src="team.png" // Replace with actual image path in your public folder
        alt="Team Photo"
        className="rounded-xl shadow-lg"
      />
    </div>
  </div>
</section>
    </div>
  )
}

export default LearnAndGrow