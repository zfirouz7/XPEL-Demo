import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full max-w-4xl text-center mb-3">
      <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        XPEL Color PPF Visualizer
      </h1>
      <h2 className="text-2xl sm:text-3xl font-semibold mt-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
        Your Car. Your Color. <br />Your Style.
      </h2>
      <p className="text-lg text-gray-600 mt-2">
        Express yourself without saying a word. Our latest paint protection film comes in a variety of bold colors to show off your signature style. Upload a photo of your car and see it in a new color instantly.
      </p>
    </header>
  );
};