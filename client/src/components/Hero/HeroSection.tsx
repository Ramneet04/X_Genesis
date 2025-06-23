import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Award, Shield } from 'lucide-react';
import RatingCard from './HeroCard';

// Mock CertificateCard component since it's not available
// const CertificateCard = () => (
//   <div className="w-80 h-96 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl shadow-xl border border-gray-200 flex items-center justify-center">
//     <div className="text-center">
//       <Award className="w-16 h-16 mx-auto mb-4 text-purple-600" />
//       <h3 className="text-xl font-bold text-gray-800">Certificate Card</h3>
//       <p className="text-gray-600 mt-2">Sample certificate display</p>
//     </div>
//   </div>
// );

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="bg-white relative z-10 flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
      {/* Left Content */}
      <div className={`lg:w-[60%] flex flex-col justify-center px-6 lg:px-12 py-12 lg:py-20 space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}>
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-purple-600 font-medium">
            <Shield className="w-5 h-5" />
            <span>Blockchain Verified</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 bg-clip-text text-transparent">
              Verifiable
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Academic
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Credentials
            </span>
            <br />
            <span className="text-gray-700">on the </span>
            <span className="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
              Blockchain
            </span>
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
            XGenesis empowers students and institutions to mint soulbound NFTs for verified certificates, projects, and achievements with immutable blockchain security.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-1">
            <Button className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 hover:from-purple-700 hover:via-blue-700 hover:to-pink-700 border-0 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
              <div className=''>
                <Award className="w-6 h-6 mr-2 text-white" />
              </div>
              <p className='text-white font-semibold'>GET STARTED</p>
            </Button>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 px-8 py-4 text-lg transition-all duration-300">
              View Demo
            </Button>
          </div>

          <div className="flex items-center space-x-8 pt-1">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">10K+</div>
              <div className="text-sm text-gray-500">Credentials Issued</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">500+</div>
              <div className="text-sm text-gray-500">Institutions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">99.9%</div>
              <div className="text-sm text-gray-500">Verified</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Placeholder for Card */}
      <div className="pb-20 pr-10 flex items-center justify-center">
        {/* Placeholder */}
        <div className="flex items-center justify-center text-purple-600 text-sm">
          <RatingCard/>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;