import React, { useEffect, useState } from 'react'

const Navbar = () => {
     const [scrolled, setScrolled] = useState(false);

     const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // adjust threshold if needed
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50); // adjust threshold as needed
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className={`flex items-center justify-between px-6 py-4 bg-black text-white shadow-lg fixed top-0 left-0 w-full z-50 transition-colors duration-300 bg-black text-white ${
        isScrolled ? "bg-white text-black shadow-md" : "bg-black text-white"
      }`}>
       <div className='flex items-center space-x-2'>
        <a href="/" ><img src="logo.png" alt="" className='w-16 h-16 rounded-full object-cover border-2 border-white hover:scale-105 transition-transform duration-300' /></a>
            
            <div className="text-left leading-tight">
                <span className="block text-2xl font-semibold text-cyan-400">TDA</span>
                <span className="block text-sm font-medium text-blue-400 -mt-1">MIT</span>
            </div>
       </div>

         <div className="hidden md:flex space-x-6 font-medium text-gray-700">
            <a href="/" className="hover:text-blue-500 transition-colors duration-300">HOME</a>
            <a href="/about" className="hover:text-blue-500 transition-colors duration-300">ABOUT</a>
            <a href="/team" className="hover:text-blue-500 transition-colors duration-300">TEAM</a>
            <a href="/events" className="hover:text-blue-500 transition-colors duration-300">EVENTS</a>
            <a href="/news" className="hover:text-blue-500 transition-colors duration-300">NEWS</a>
            
        </div>

        <div className="flex items-center space-x-4">
  {/* ADMIN Button */}
  <a 
    href="/login" 
    className="hidden md:block bg-gradient-to-r from-purple-400 to-cyan-400 text-white px-4 py-1 rounded shadow-md 
    hover:shadow-xl hover:scale-105 transition-transform duration-300"
  >
    ADMIN
  </a>

  {/* Hamburger Menu */}
  <div className="md:hidden space-y-1 cursor-pointer group">
    <span className="block w-6 h-0.5 bg-purple-500 transition-all duration-300 group-hover:bg-cyan-400 group-hover:scale-x-110"></span>
    <span className="block w-6 h-0.5 bg-purple-500 transition-all duration-300 group-hover:bg-cyan-400 group-hover:scale-x-125"></span>
    <span className="block w-6 h-0.5 bg-purple-500 transition-all duration-300 group-hover:bg-cyan-400 group-hover:scale-x-110"></span>
  </div>
</div>

    </div>
  )
}

export default Navbar