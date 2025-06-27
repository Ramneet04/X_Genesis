import React, { useEffect, useState } from 'react';

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation on component mount
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`
        bg-gray-950 text-gray-200 min-h-screen p-6 sm:p-10 lg:p-16
        flex flex-col items-center
        transition-opacity duration-1000 ease-in
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
    >
      <div className="max-w-4xl mx-auto w-full">
        {/* Header Section */}
        <header className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
            About X-Genesis
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto">
            Pioneering the next era of digital ownership and creation.
          </p>
        </header>

        {/* Mission/Introduction Section */}
        <section className="mb-12 p-6 bg-gray-900 rounded-xl shadow-lg border border-gray-700 animate-fade-in-delay-1">
          <h2 className="text-3xl font-semibold text-blue-400 mb-4">Our Mission</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            At X-Genesis, our mission is to empower creators, innovators, and collectors by providing a secure, transparent, and groundbreaking platform for digital assets. We believe in democratizing access to the metaverse, fostering a community where creativity thrives and digital ownership is truly sovereign.
          </p>
          <p className="text-gray-300 leading-relaxed">
            We are building the foundational layer for a new digital economy, ensuring that every digital creation finds its true value and every interaction is a step towards a more decentralized future.
          </p>
        </section>

        {/* Our Story/History Section */}
        <section className="mb-12 p-6 bg-gray-900 rounded-xl shadow-lg border border-gray-700 animate-fade-in-delay-2">
          <h2 className="text-3xl font-semibold text-purple-400 mb-4">Our Journey</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            Founded in [Year, e.g., 2023] by a team of blockchain enthusiasts, visionary artists, and seasoned developers, X-Genesis emerged from a shared passion for digital art and a firm belief in the transformative power of NFTs. We started with a simple idea: to create a platform that not only showcases digital masterpieces but also cultivates a vibrant ecosystem for Web3 innovation.
          </p>
          <p className="text-gray-300 leading-relaxed">
            From our early days as a small collective, we have grown into a leading force in the NFT space, driven by community feedback and a relentless pursuit of excellence. Our journey is a testament to what can be achieved when technology meets creativity.
          </p>
        </section>

        {/* Our Values Section */}
        <section className="mb-12 p-6 bg-gray-900 rounded-2xl shadow-xl border border-gray-700 animate-[fadeInFromBottom_1s_ease-out_forwards_0.6s]">
  <h2 className="text-3xl font-semibold text-cyan-400 mb-10 text-center">Our Core Values</h2> {/* Increased bottom margin for heading */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"> {/* Changed to lg:grid-cols-4 for more horizontal flow on large screens */}
    {/* Value Item 1: Innovation */}
    <div className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-lg shadow-md hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
      <div className="text-5xl mb-4 text-cyan-400">💡</div> {/* Larger icon, themed color */}
      <h3 className="text-xl font-medium text-gray-100 mb-2">Innovation</h3>
      <p className="text-gray-400 text-sm"> {/* Slightly smaller text for description */}
        We relentlessly push the boundaries of what's possible in the digital realm.
      </p>
    </div>

    {/* Value Item 2: Community */}
    <div className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-lg shadow-md hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
      <div className="text-5xl mb-4 text-purple-400">🤝</div> {/* Larger icon, themed color */}
      <h3 className="text-xl font-medium text-gray-100 mb-2">Community</h3>
      <p className="text-gray-400 text-sm">
        We foster a supportive and inclusive environment for all creators and collectors.
      </p>
    </div>

    {/* Value Item 3: Transparency */}
    <div className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-lg shadow-md hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
      <div className="text-5xl mb-4 text-blue-400">✅</div> {/* Larger icon, themed color */}
      <h3 className="text-xl font-medium text-gray-100 mb-2">Transparency</h3>
      <p className="text-gray-400 text-sm">
        Blockchain is built on trust, and so are our operations.
      </p>
    </div>

    {/* Value Item 4: Security */}
    <div className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-lg shadow-md hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
      <div className="text-5xl mb-4 text-green-400">🔒</div> {/* Larger icon, themed color */}
      <h3 className="text-xl font-medium text-gray-100 mb-2">Security</h3>
      <p className="text-gray-400 text-sm">
        Protecting digital assets and user data is our highest priority.
      </p>
    </div>
  </div>
</section>

        {/* Team Section (Simplified) */}
        <section className="mb-12 p-6 bg-gray-900 rounded-xl shadow-lg border border-gray-700 animate-fade-in-delay-4">
          <h2 className="text-3xl font-semibold text-green-400 mb-4">Meet the Team</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            X-Genesis is powered by a diverse team of passionate experts in blockchain, AI, UI/UX design, and community building. While our team is currently building in stealth, rest assured that every member is dedicated to bringing you the most innovative and reliable platform in the metaverse.
          </p>
          <p className="text-gray-300 leading-relaxed">
            We are always looking for visionary talent. If you share our passion, consider joining us on this exciting journey!
          </p>
          <div className="text-center mt-6">
            <a
              href="/careers" // Replace with your careers page link
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Join Our Team
            </a>
          </div>
        </section>

        {/* Call to Action/Contact */}
        <section className="text-center p-6 bg-gray-900 rounded-xl shadow-lg border border-gray-700 animate-fade-in-delay-5">
          <h2 className="text-3xl font-semibold text-gray-100 mb-4">Have Questions?</h2>
          <p className="text-lg text-gray-400 mb-6">
            We'd love to hear from you. Reach out and connect with the X-Genesis community.
          </p>
          <a
            href="/contact" // Replace with your contact page link
            className="inline-block bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Contact Us
          </a>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;

// You might also want to add these simple keyframe animations to your global CSS
// or configure them in your tailwind.config.js for cleaner code:

/*
@keyframes fadeInFromBottom {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fadeInFromBottom 1s ease-out forwards;
}

.animate-fade-in-delay-1 { animation: fadeInFromBottom 1s ease-out forwards 0.2s; }
.animate-fade-in-delay-2 { animation: fadeInFromBottom 1s ease-out forwards 0.4s; }
.animate-fade-in-delay-3 { animation: fadeInFromBottom 1s ease-out forwards 0.6s; }
.animate-fade-in-delay-4 { animation: fadeInFromBottom 1s ease-out forwards 0.8s; }
.animate-fade-in-delay-5 { animation: fadeInFromBottom 1s ease-out forwards 1s; }
*/