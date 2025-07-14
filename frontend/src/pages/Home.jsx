import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import WhatWeDo from '../components/WhatWeDo'
import Footer from '../components/Footer'
import JoinForm from '../components/JoinForm'
import LearnAndGrow from '../components/LearnAndGrow'

const Home = () => {
  return (
    <div>
        <Navbar/>
        <Hero/>
        <section className="bg-gray-50 py-16 px-4 sm:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Column 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What is TDA?</h2>
            <p className="text-gray-600 leading-relaxed">
              TDA (The Data Alchemists) is a forward-thinking creative student body that specializes in
              branding, UI/UX design, and digital experiences. We help businesses define their identity
              and stand out in the digital world.
            </p>
          </div>

          {/* Column 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What We Do</h2>
            <p className="text-gray-600 leading-relaxed">
              Our team crafts seamless digital solutions — from wireframes and UI mockups to fully
              functional web applications. We combine design and technology to elevate your brand’s
              digital presence.
            </p>
          </div>
        </div>
      </section>
      <WhatWeDo/>
        <LearnAndGrow/>
    <JoinForm/>
    <Footer/>

    </div>
  )
}

export default Home