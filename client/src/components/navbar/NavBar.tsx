import React, { useState } from 'react';
import { Search, Bell, Menu, X, ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const dropdownItems = {
    explore: ['NFT Gallery', 'Institutions', 'Certificates', 'Achievements'],
    about: ['Our Mission', 'Team', 'Roadmap', 'Partners'],
  };

  return (
    <nav className="relative z-50 w-full border-b border-purple-800/40 bg-black backdrop-blur-l">
      <div className="flex justify-between items-center p-4 lg:px-12 w-full text-white">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-xl animate-pulse flex justify-center items-center text-3xl font-extrabold">✘</div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 bg-clip-text text-transparent">
         Genesis
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-6">
          <a href="#" className="hover:text-purple-400 transition-all">Home</a>

          {/* Explore Dropdown */}
          <div className="relative">
            <button
              onMouseEnter={() => setActiveDropdown('explore')}
              onMouseLeave={() => setActiveDropdown(null)}
              className="flex items-center space-x-1 hover:text-purple-400"
            >
              <span>Explore</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {activeDropdown === 'explore' && (
              <div
                className="absolute top-full mt-2 w-48 bg-gray-900/95 border border-purple-700/40 rounded-xl shadow-lg py-2"
                onMouseEnter={() => setActiveDropdown('explore')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {dropdownItems.explore.map((item, index) => (
                  <a key={index} href="#" className="block px-4 py-2 text-sm hover:bg-purple-800/20 hover:text-purple-400">
                    {item}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* About Dropdown */}
          <div className="relative">
            <button
              onMouseEnter={() => setActiveDropdown('about')}
              onMouseLeave={() => setActiveDropdown(null)}
              className="flex items-center space-x-1 hover:text-purple-400"
            >
              <span>About</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {activeDropdown === 'about' && (
              <div
                className="absolute top-full mt-2 w-48 bg-gray-900/95 border border-purple-700/40 rounded-xl shadow-lg py-2"
                onMouseEnter={() => setActiveDropdown('about')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {dropdownItems.about.map((item, index) => (
                  <a key={index} href="#" className="block px-4 py-2 text-sm hover:bg-purple-800/20 hover:text-purple-400">
                    {item}
                  </a>
                ))}
              </div>
            )}
          </div>

          <a href="#" className="flex items-center gap-1 hover:text-purple-400">
            <Globe className="w-4 h-4" />
            <span>Community</span>
          </a>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-2 bg-gray-800/50 rounded-xl px-4 py-2 border border-purple-700/40">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-400 w-40"
            />
          </div>

          {/* Auth Buttons */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="border border-purple-700/50 text-purple-400 hover:bg-purple-800/20"
            >
              Login
            </Button>
            <Button className="bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 hover:from-purple-600 hover:via-blue-600 hover:to-pink-600 text-white font-medium shadow-lg shadow-purple-500/20">
              Signup
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden">
            {mobileMenuOpen ? <X className="text-white" /> : <Menu className="text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-purple-700/40 bg-black/95 backdrop-blur-xl">
          <div className="p-4 space-y-4">
            <a href="#" className="block py-2 hover:text-purple-400">Home</a>
            <a href="#" className="block py-2 hover:text-purple-400">Explore</a>
            <a href="#" className="block py-2 hover:text-purple-400">About</a>
            <a href="#" className="block py-2 hover:text-purple-400">Community</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
