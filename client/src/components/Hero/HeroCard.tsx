import React, { useState, useEffect } from 'react'; // Import useState and useEffect

const nftData = [
  // Keeping only 3 images for the collage
  {
    img: "https://res.cloudinary.com/ddlepk8lb/image/upload/v1750954071/Gemini_Generated_Image_8z1gon8z1gon8z1g_t7icqt.png",
    size: "small" // This image will be the larger one
  },
  {
    img: "https://res.cloudinary.com/ddlepk8lb/image/upload/v1750961882/Gemini_Generated_Image_o62qn1o62qn1o62q_a8w9uy.png",
    size: "small" // This image will be the larger one
  },
  {
    img: "https://res.cloudinary.com/ddlepk8lb/image/upload/v1750961601/Gemini_Generated_Image_pkc1fgpkc1fgpkc1_f5nzyo.png",
    size: "small" // These will be smaller
  },
  {
    img: "https://res.cloudinary.com/ddlepk8lb/image/upload/v1750961548/Gemini_Generated_Image_fn17w6fn17w6fn17_zwg84r.png",
    size: "small" // These will be smaller
  },
];

const RatingCard = () => {
  const [cardsVisible, setCardsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setCardsVisible(true);
  }, []);

  return (
    // The grid container will have 2 columns
    <div className="grid grid-cols-2 gap-4 p-4 max-w-[700px] mx-auto auto-rows-[180px] sm:auto-rows-[220px] ">
      {nftData.map((nft, index) => (
        <div
          key={index}
          className={`
            group relative // Add 'group' class here to enable group-hover effects
            bg-gradient-to-br from-gray-800 to-gray-900 // Dark gradient background for depth
            rounded-xl border border-gray-700 // Subtle border for definition
            shadow-xl shadow-gray-950/50 // Darker, more pronounced initial shadow
            p-2 flex flex-col items-center justify-center overflow-hidden

            // Initial Load Animation (staggered fade-in and slide-up)
            ${cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            transition-all duration-700 ease-out // Faster transition for initial load
            transform // Ensure transform is available for translate-y, scale, and rotate
            
            // Staggered delay for initial animation
            ${index === 0 ? 'delay-0' : index === 1 ? 'delay-100' : 'delay-200'}

            // Hover Effects
            hover:scale-[1.02] hover:-translate-y-1 hover:rotate-1 // Lift, slight scale, AND slight rotation on hover
            hover:shadow-2xl hover:shadow-purple-500/40 // Enhanced glowing shadow on hover
            
            // Ensure transitions for hover effects are smooth and take priority
            // by placing this general transition *after* the initial load transition
            transition-[transform,shadow,background,filter,border,ring] duration-300 ease-in-out
            
            ${nft.size === "large" ? 'col-span-2' : ''} /* Make the first image span both columns */
          `}
        >
          <img
            src={nft.img}
            alt={`NFT ${index}`}
            className={`
              rounded-2xl // Slightly less rounded for image compared to card for contrast
              w-full h-full object-cover // Ensure image fills and covers
              shadow-2xl shadow-gray-950 // Deeper shadow shadow-sky-200 for image itself
              
              // Transition for image-specific effects
              transition-all duration-300 ease-in-out
              
              // Image effects on parent card hover
              group-hover:brightness-110 group-hover:contrast-110 // Brighten and contrast on hover
              group-hover:ring-2 group-hover:ring-blue-500 group-hover:ring-offset-2 group-hover:ring-offset-gray-900 // Glowing ring on hover
            `}
          />
        </div>
      ))}
    </div>
  );
};

export default RatingCard;


