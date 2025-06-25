import { useState } from 'react';
import { Search, Menu, X, ChevronDown, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);

  const dropdownItems = {
    explore: ['NFT Gallery', 'Institutions', 'Certificates', 'Achievements'],
    about: ['Our Mission', 'Team', 'Roadmap', 'Partners'],
  };

  const handleMouseEnter = (dropdown: string) => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
    }, 200); // 200ms delay before closing
    setDropdownTimeout(timeout);
  };

  return (
    <nav className="relative z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="flex justify-between items-center p-4 lg:px-12 w-full">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 rounded-xl animate-pulse flex justify-center items-center text-3xl font-extrabold text-white">✘</div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 bg-clip-text text-transparent">
            Genesis
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-6">
          <a href="#" className="text-zinc-800 hover:text-gray-900 font-medium transition-colors">
            Home
          </a>
          
          {/* Explore Dropdown */}
          <div className="relative">
            <button
              onMouseEnter={() => handleMouseEnter('explore')}
              onMouseLeave={handleMouseLeave}
              className="flex items-center space-x-1 text-zinc-800 hover:text-gray-900 font-medium transition-colors"
            >
              <span>Explore</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {activeDropdown === 'explore' && (
              <div
                className="absolute top-full mt-2 w-48 bg-white sahdow shadow-gray-600 rounded-xl shadow-lg py-2 z-50"
                onMouseEnter={() => handleMouseEnter('explore')}
                onMouseLeave={handleMouseLeave}
              >
                {dropdownItems.explore.map((item, index) => (
                  <a 
                    key={index} 
                    href="#" 
                    className="block font-semibold px-4 py-3 text-sm text-gray-600 rounded-xl hover:bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 hover:text-white transition-colors border border-gray-100"
                  >
                    {item}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <a href="#" className="text-zinc-800 hover:text-gray-900 font-medium transition-colors">
              About Us
            </a>
          </div>

          <a href="#" className="flex items-center gap-1 text-zinc-800 hover:text-gray-900 font-medium transition-colors">
            <Globe className="w-4 h-4" />
            <span>Community</span>
          </a>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="hidden md:flex items-center space-x-2 bg-gray-200 rounded-3xl px-4 py-2.5 border border-gray-400">
            <Search className="w-6 h-4 text-gray-900 text-md" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm text-black placeholder-gray-600 w-40"
            />
          </div>

          {/* Auth Buttons */}
          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="rounded-xl border bg-zinc-800 text-white border-gray-300  hover:bg-gray-200 hover:text-gray-900 transition-colors"
            >
              Login
            </Button>
            <Button className="rounded-xl bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 hover:from-purple-600 hover:via-blue-600 hover:to-pink-600 text-white font-medium shadow-lg shadow-purple-500/20">
              Signup
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="text-gray-700" /> : <Menu className="text-gray-700" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="p-4 space-y-4">
            <a href="#" className="block py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors">Home</a>
            <a href="#" className="block py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors">Explore</a>
            <a href="#" className="block py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors">About</a>
            <a href="#" className="block py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors">Community</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;