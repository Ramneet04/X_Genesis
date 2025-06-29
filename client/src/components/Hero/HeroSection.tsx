import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Award, Shield } from 'lucide-react';
import RatingCard from './HeroCard'; // Assuming HeroCard is your single, dark-themed card
import toast from 'react-hot-toast';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Define the NFT data for the single card here, as it's used in this component
  const featuredNft = {
    // Placeholder image for an AWS certificate.
    // Replace this URL with an actual image of your AWS certificate or a relevant icon.
    img: "https://res.cloudinary.com/ddlepk8lb/image/upload/v1750954071/Gemini_Generated_Image_8z1gon8z1gon8z1g_t7icqt.png", // Conceptual Cloudinary URL or a placeholder
    title: "AWS Certified Solutions Architect - Associate", // Specific AWS certification title
    description: "Successfully obtained the AWS Certified Solutions Architect - Associate certification, demonstrating proficiency in designing scalable, highly available, and fault-tolerant systems on the Amazon Web Services (AWS) platform.", // Detailed description
    tags: ["AWS", "Cloud Computing", "Solutions Architect", "Certification", "Cloud Architecture", "Infrastructure-as-Code"], // Relevant AWS tags
    category: "Cloud Certification", // Specific category for AWS cert
    walletAddress: "0xAwScert1234567890AwScert1234567890AwScert123", // Example wallet address
    rating: 4.9, // High rating for a well-recognized cert
    likes: 187, // Increased likes to reflect popularity
    verifiedBy: "Amazon Aws" // AWS is an institute for verification
  };

  return (
    <div className="bg-gray-950 relative z-10 flex flex-col lg:flex-row min-h-[calc(100vh-80px)] overflow-hidden">
      {/* Pattern Overlay - Updated for dark theme */}
      <div
        className="absolute inset-0 z-0 opacity-20" // Adjust opacity for subtlety on dark background
        style={{
          backgroundImage: `
            linear-gradient(to right, #333 1px, transparent 1px),
            linear-gradient(to bottom, #333 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px' // Adjust size of grid cells
        }}
      ></div>

      {/* Radial Gradient for Top-Left Light Source */}
      <div className="absolute inset-0 z-0"
           style={{
             // Changed 'at top' to 'at top left'
             background: 'radial-gradient(circle at top left, rgba(200, 200, 200, 0.08) 10%, transparent 70%)'
             // Increased opacity slightly to 0.08 and shortened spread to 60% for a more focused glow
           }}>
      </div>


      {/* Left Content (ensure it's above the pattern with z-index) */}
      <div className={`lg:w-[60%] flex flex-col justify-center px-6 lg:px-12 py-12 lg:py-20 space-y-8 transform transition-all duration-1000 relative z-10 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}>
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sky-600 font-medium">
            <Shield className="w-5 h-5" />
            <span>Blockchain Verified</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-gray-200 via-blue-200 to-gray-300 bg-clip-text text-transparent">
              Verifiable
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
              Academic
            </span>
            <br />
            <span className="bg-gradient-to-r from-indigo-300 via-blue-300 to-indigo-400 bg-clip-text text-transparent">
              Credentials
            </span>
            <br />
            <span className="text-gray-300">on the </span>
            <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 bg-clip-text text-transparent">
              Blockchain
            </span>
          </h1>

          <p className="text-xl text-gray-400 leading-relaxed max-w-lg">
            From verified skills to published papers — mint it all.
XGenesis brings academic and professional credentials to the blockchain as NFTs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-1">
            <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 border-0 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25">
              <div className=''>
                <Award className="w-6 h-6 mr-2 text-white" />
              </div>
              <p className='text-white font-semibold'>GET STARTED</p>
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-4 text-lg transition-all duration-300">
              View Demo
            </Button>
          </div>

          <div className="flex items-center space-x-8 pt-1">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">10K+</div>
              <div className="text-sm text-gray-500">Credentials Issued</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">500+</div>
              <div className="text-sm text-gray-500">Institutions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-400">99.9%</div>
              <div className="text-sm text-gray-500">Verified</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side for Card (ensure it's above the pattern with z-index) */}
      <div className="lg:w-[40%] flex items-center justify-center p-6 md:p-10 relative z-10 mr-20">
        <RatingCard /> {/* Pass the featuredNft data to the card */}
      </div>
    </div>
  );
};

export default HeroSection;