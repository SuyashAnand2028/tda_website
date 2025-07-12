
import React, { useState } from 'react';
import {ReactTyped} from 'react-typed';


const Hero = () => {
  const [mouse, setMouse] = useState({ x: -9999, y: -9999 });

  const handleMouseMove = (e) => {
    setMouse({ x: e.clientX, y: e.clientY });
  };

  const randomCode = `
#include <stdio.h>
int main() {
  for(int i=0;i<10;i++) {
    printf("TDAMIT\\n");
  }
  return 0;
}

def innovate(team):
  return [member.upper() for member in team]

const vision = "Innovation and design with hands on experience"
`;

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative h-screen w-full bg-black overflow-hidden"
    >
      {/* Background Code Layer */}
      <div className="absolute inset-0 z-0 text-green-400 font-mono text-xs leading-tight select-none pointer-events-none flex flex-wrap">
  {Array.from({ length: 100 }).map((_, i) => (
    <pre
      key={i}
      className="w-[20%] p-2 whitespace-pre-wrap break-words"
    >
{`
#include <stdio.h>
int main() {
  for(int i=0;i<10;i++) {
    printf("ChipMIT\\n");
  }
  return 0;
}

def innovate(team):
  return [member.upper() for member in team]

const vision = "Innovation and design with hands on experience"
`}
    </pre>
  ))}
</div>

      {/* Spotlight Mask Layer */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mouse.x}px ${mouse.y}px, rgba(0,0,0,0) 100px, rgba(0,0,0,0.9) 200px, rgba(0,0,0,1) 300px)`,
          mixBlendMode: 'darken',
        }}
      ></div>

      {/* Foreground Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center text-white">
        <img
          src="logo.png"
          alt="Club Logo"
          className="h-28 md:h-36 mb-6 transition-transform duration-500 hover:scale-110 hover:rotate-2 hover:drop-shadow-lg"
        />
        <h1 className="text-4xl md:text-6xl font-bold">
          We{' '}
          <ReactTyped
            strings={['Code!', 'Build!', 'Design!', 'Innovate!','Create!']}
            typeSpeed={100}
            backSpeed={50}
            loop
          />
        </h1>
        <p className="mt-4 text-lg md:text-xl text-blue-400 font-medium">
          Come be a part of us.
        </p>

        <div className="mt-10 text-gray-400 animate-bounce">
          <p className="uppercase text-sm tracking-widest">Scroll Down</p>
          <div className="text-xl">↓</div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
