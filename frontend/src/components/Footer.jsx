import React from 'react'

const Footer = () => {
  return (
    <div>

    <footer className="bg-black text-white py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Logo & About */}
        <div>
          <div className="flex items-center gap-2">
            <img src="logo.png" alt="Club Logo" className="w-10 h-10" />
            <h2 className="text-xl font-bold">TDA MIT</h2>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            The Data Alchemists– a student-led creative tech club dedicated to digital design, development, and innovation.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="/" className="hover:text-white transition">Home</a></li>
            <li><a href="/about" className="hover:text-white transition">About</a></li>
            <li><a href="/team" className="hover:text-white transition">Team</a></li>
            <li><a href="" className="hover:text-white transition">Contact</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-4 text-gray-400">
            <a href="#" aria-label="Instagram" className="hover:text-white transition">
              <i className="fab fa-instagram text-xl"></i>
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-white transition">
              <i className="fab fa-linkedin text-xl"></i>
            </a>
            <a href="#" aria-label="GitHub" className="hover:text-white transition">
              <i className="fab fa-github text-xl"></i>
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact</h3>
          <p className="text-sm text-gray-400">tda@mit.edu</p>
          <p className="text-sm text-gray-400 mt-1">Manipal Institute of Technology</p>
        </div>
      </div>

      {/* Bottom Note */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} TDA MIT. All rights reserved.
      </div>
    </footer>

    </div>
  )
}

export default Footer