import React from 'react'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

const About = () => {
  return (
    <div>
    <div className="bg-gray-900 text-white">
        <Navbar/>
      <Hero />

      {/* Mission & Vision */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-semibold text-cyan-400 mb-4">Our Mission</h2>
          <p className="text-gray-300">
            To empower students by creating an environment where innovation, creativity, and collaboration thrive. We strive to upskill our members in design, development, and leadership through hands-on learning and community projects.
          </p>
        </div>
        <div>
          <h2 className="text-3xl font-semibold text-cyan-400 mb-4">Our Vision</h2>
          <p className="text-gray-300">
            To become a recognized student-led initiative that sets benchmarks in creative technology, fosters meaningful connections, and nurtures future-ready professionals.
          </p>
        </div>
      </section>

      {/* What We Do / Highlights */}
      <section className="bg-gray-800 py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold text-cyan-400 mb-6">What We Do</h2>
        <p className="max-w-3xl mx-auto text-gray-300 mb-12">
          Our club spans across multiple domains like coding, design, ML, and content. We host workshops, hackathons, design challenges, and real-world projects for social good and skill building.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { title: "Summer BootCamp", icon: "🛠️" },
            { title: "Hackathons & CTFs", icon: "💻" },
            { title: "Live Projects", icon: "🚀" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-gray-700 p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
              <p className="text-gray-300">
                {item.title === "Technical Workshops"
                  ? "Hands-on sessions on trending tech."
                  : item.title === "Hackathons & CTFs"
                  ? "Real-time problem solving and competitions."
                  : "Collaborate with teams on actual projects and deployments."}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Culture */}
      <section className="py-16 px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-semibold text-cyan-400 mb-6">Our Culture</h2>
        <p className="text-gray-300 max-w-3xl mx-auto mb-8">
          We believe in teamwork, inclusivity, and learning by doing. Whether it’s pushing code at midnight or designing event posters, we’re in it together—fuelled by passion and curiosity.
        </p>
        <p className="text-gray-500 italic">
          "We don’t just work together. We grow together."
        </p>
      </section>

      {/* Meet the Team CTA */}
      <section className="bg-gray-800 py-16 px-6 text-center">
        <h2 className="text-3xl font-semibold text-cyan-400 mb-4">Meet the Team</h2>
        <p className="text-gray-300 mb-6">
          Our interdisciplinary team is made up of passionate designers, developers, strategists, and learners.
        </p>
        <a
          href="/team"
          className="inline-block bg-cyan-500 hover:bg-cyan-600 transition text-white font-semibold px-6 py-3 rounded"
        >
          See Our Team →
        </a>
      </section>

      {/* Join Us CTA */}
      <section className="py-20 px-6 text-center bg-black">
        <h2 className="text-4xl font-bold text-white mb-4">Want to Join Us?</h2>
        <p className="text-gray-400 mb-8">
          We’re always looking for enthusiastic minds. Whether you're into design, coding, or organizing events, there’s a place for you.
        </p>
        <a
          href="#"
          className="inline-block bg-cyan-500 hover:bg-cyan-600 transition text-white font-semibold px-6 py-3 rounded"
        >
          Apply Now
        </a>
      </section>
      <Footer/>
    </div>

    </div>
  )
}

export default About