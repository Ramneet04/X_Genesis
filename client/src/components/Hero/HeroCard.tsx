import { Star, Heart } from "lucide-react";

const nftData = [
  {
    img: "https://res.cloudinary.com/ddlepk8lb/image/upload/v1750856185/ChatGPT_Image_Jun_25_2025_05_21_31_PM_yvhpo9.png",
    rating: 4.8,
    stars: "⭐⭐⭐½",
    likes: 124,
    size: "row-span-2 col-span-1", // tall card
  },
  {
    img: "https://res.cloudinary.com/ddlepk8lb/image/upload/v1750855210/ChatGPT_Image_Jun_25_2025_06_09_47_PM_pxjjeh.png",
    rating: 4.6,
    stars: "⭐⭐⭐",
    likes: 112,
    size: "row-span-2 col-span-2", // large square card
  },
  {
    img: "https://res.cloudinary.com/ddlepk8lb/image/upload/v1750856149/ChatGPT_Image_Jun_25_2025_06_22_17_PM_wewnh1.png",
    rating: 4.9,
    stars: "⭐⭐⭐⭐",
    likes: 143,
    size: "row-span-1 col-span-2", // wide card
  },
  {
    img: "https://res.cloudinary.com/ddlepk8lb/image/upload/v1750855644/ChatGPT_Image_Jun_25_2025_06_12_50_PM_kfnbbd.png",
    rating: 4.7,
    stars: "⭐⭐⭐½",
    likes: 98,
    size: "row-span-1 col-span-1", // normal card
  },
];

const RatingCard = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[150px] gap-4 p-4 m-8">
      {nftData.map((nft, index) => (
        <div
          key={index}
          className={`bg-white rounded-xl shadow-md p-2 flex flex-col justify-between space-y-2 ${nft.size}`}
        >
          <img
            src={nft.img}
            alt={`NFT ${index}`}
            className="rounded-lg w-full h-full object-cover flex-1"
          />

          {/* Rating, Stars, Likes */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-semibold text-gray-800">
                {nft.rating}
              </span>
            </div>

            <div className="text-yellow-400 text-xs opacity-70 font-medium">
              {nft.stars}
            </div>

            <div className="flex items-center space-x-1 text-red-500">
              <Heart className="w-4 h-4 fill-red-500" />
              <span className="text-sm font-semibold text-gray-700">
                {nft.likes}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RatingCard;
