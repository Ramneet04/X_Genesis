import { useState } from 'react';
import { Search, Menu, X, ChevronDown, Globe, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@/main';
import ProfileDropDown from './ProfileDropDown';
import WalletConnectButton from '../auth/ConnectWallet';

const Navbar = () => {
  
  const {token, user} = useAppSelector((state)=> state.user);


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
    <nav className="relative z-50 w-full border-b border-gray-700 bg-gradient-to-r from-gray-900 via-gray-950 to-black shadow-lg shadow-gray-950/50">
      <div className="flex justify-between items-center p-4 lg:px-12 w-full">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          {/* <div className="w-10 h-10 bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 rounded-xl animate-pulse flex justify-center items-center text-3xl font-extrabold text-white">✘</div> */}
          <img src="https://res.cloudinary.com/ddlepk8lb/image/upload/v1751051815/x_genesis_logo3_w9eyr4.jpg" alt="" width={55} className='rounded-xl shadow-md shadow-sky-300'/>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-pink-400 bg-clip-text text-transparent">
            Genesis
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-6">
          <Link to={"/"} className="text-gray-300 hover:text-white font-medium transition-colors">
            Home
          </Link>
          
          {/* Explore Dropdown */}
          <div className="relative">
            <button
              onMouseEnter={() => handleMouseEnter('explore')}
              onMouseLeave={handleMouseLeave}
              className="flex items-center space-x-1 text-gray-300 hover:text-white font-medium transition-colors"
            >
              <span>Explore</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {activeDropdown === 'explore' && (
              <div
                className="absolute top-full mt-2 w-48 bg-gray-900 rounded-xl shadow-lg shadow-gray-950/40 py-2 z-50"
                onMouseEnter={() => handleMouseEnter('explore')}
                onMouseLeave={handleMouseLeave}
              >
                {dropdownItems.explore.map((item, index) => (
                  <a 
                    key={index} 
                    href="#" 
                    className="block font-semibold px-4 py-3 text-sm text-gray-300 rounded-xl hover:bg-gradient-to-r hover:from-cyan-600 hover:via-blue-700 hover:to-indigo-800 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <Link to={"/aboutUs"} className="text-gray-300 hover:text-white font-medium transition-colors">
              About Us
            </Link>
          </div>

          <a href="#" className="flex items-center gap-1 text-gray-300 hover:text-white font-medium transition-colors">
            <Globe className="w-4 h-4" />
            <span>Community</span>
          </a>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
         <Link to="/create-nft">
           <Button className="hidden md:flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-600 text-white font-semibold">
             <PlusCircle className="w-5 h-5" />
             <span>Create NFT</span>
           </Button>
         </Link>

          {
            token === null && (
               <div className="flex space-x-2">
            <Button
              variant="outline"
              className="rounded-xl border border-gray-600 bg-gray-800 text-white hover:bg-gray-700 hover:border-gray-500 transition-colors"
            >
              <Link to={"/login"}>Login</Link>
            </Button>
            <Button className="rounded-xl bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 hover:from-purple-700 hover:via-blue-700 hover:to-pink-700 text-white font-medium shadow-lg shadow-purple-600/30">
              <Link to={"/signup"}>Signup</Link>
            </Button>
          </div>
            )
          }
          {
            token !== null && (
              <WalletConnectButton/>
            )
          }
          {
            token !== null && (<ProfileDropDown />)
          }
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="text-gray-300" /> : <Menu className="text-gray-300" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-700 bg-gray-900">
          <div className="p-4 space-y-4">
            <a href="#" className="block py-2 text-gray-300 hover:text-white font-medium transition-colors">Home</a>
            <a href="#" className="block py-2 text-gray-300 hover:text-white font-medium transition-colors">Explore</a>
            <a href="#" className="block py-2 text-gray-300 hover:text-white font-medium transition-colors">About</a>
            <a href="#" className="block py-2 text-gray-300 hover:text-white font-medium transition-colors">Community</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;